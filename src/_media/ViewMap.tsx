import {
    Component,
    Show,
    createEffect,
    createResource,
    createSignal,
    onCleanup,
    onMount
} from "solid-js";
import { Cluster, MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import { MapTypeIdType } from "../_models/MapType";
import { MapZoomLevelIdType } from "../_models/MapZoomLevel";
import { ResolvedThemeIdType, ThemeDark } from "../_models/Theme";

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { getGoogleMapsUrl } from "../_models/utils/GpsUtils";
import { pathEndColor, pathSegmentColors, pathStartColor } from "./_pathGradient";
import { IMapsMediaService } from "./services/IMapsMediaService";
import { SlideshowService } from "./services/SlideshowService";
import { GpsCoordinate } from "../_models/GpsCoordinate";
import { MediaViewMap } from "../_models/MediaView";
import { Uuid } from "../_models/Uuid";

import MediaToolbar from "./MediaToolbar";
import Toolbar from "./Toolbar";
import Inspector from "../_components/inspector/Inspector";
import Layout from "../_components/layout/Layout";
import EmptyState from "../_components/state/EmptyState";
import MapMediaPreview from "./MapMediaPreview";

// a photo's marker: the print in its frame, and the tail pointing at where it was taken
interface Pin {
    element: HTMLDivElement;
    frame: HTMLDivElement;
    img: HTMLImageElement;
    tail: HTMLDivElement;
}

interface Props {
    mediaService: IMapsMediaService;
    slideshowService: SlideshowService;
    mapState: { mapType: MapTypeIdType; mapZoom: MapZoomLevelIdType; mapShowPath: boolean };
    // fixed for the life of the map, which only takes a color scheme when made
    theme: ResolvedThemeIdType;
    setMapType: (mapType: string) => void;
    setZoom: (zoom: number) => void;
    setShowPath: (showPath: boolean) => void;
}

const ViewMap: Component<Props> = props => {
    const [isMounted, setIsMounted] = createSignal(false);
    const [markersAdded, setMarkersAdded] = createSignal(false);
    let el: HTMLDivElement | undefined;
    let map: google.maps.Map;
    let infoWindow: google.maps.InfoWindow;
    // opens the info window on each photo's marker, for showing the active photo
    const openers = new Map<Uuid, () => void>();
    // the photo behind each marker, so a cluster can show one of its own
    const mediaByMarker = new Map<google.maps.marker.AdvancedMarkerElement, Media>();
    // each photo marker's pin, for marking it
    const pinByMarker = new Map<google.maps.marker.AdvancedMarkerElement, Pin>();
    // the photos the info window is showing - one, or a cluster's - and none once it closes
    let highlighted = new Set<google.maps.marker.AdvancedMarkerElement>();
    // the cluster markers drawn so far, each with the photos it holds and the pin it shows
    const clusterPins = new Map<
        google.maps.marker.AdvancedMarkerElement,
        { markers: google.maps.marker.AdvancedMarkerElement[]; pin: Pin }
    >();
    let clusterer: MarkerClusterer | undefined;
    /*
       A photo's info window opened before the clusters were drawn - on arriving
       at the map with a photo already chosen - and so placed at the photo with
       nothing to sit above. Opened again once they are.
    */
    let reopenWhenClustered: (() => void) | undefined;
    // the photo shown large over the map, from the magnifier on its info window
    const [previewMedia, setPreviewMedia] = createSignal<Media>();

    onCleanup(() => clusterer?.setMap(null));

    /*
       A photo where a pin would be, made to read as one: a print in a white
       frame, with a tail whose tip - where the marker anchors - is the spot it
       was taken. The frame is set off by a thin dark edge as well as a shadow,
       so it stands out on pale roads and busy satellite imagery alike. The edge
       is a drop-shadow filter rather than an outline, so it follows the tail
       too.
    */
    const buildPin = (media: Media | undefined): Pin => {
        const element = document.createElement("div");
        const frame = document.createElement("div");
        const img = document.createElement("img");
        const tail = document.createElement("div");

        element.className = "flex flex-col items-center";
        element.style.filter =
            "drop-shadow(0 0 1px rgb(0 0 0 / 0.8)) drop-shadow(0 2px 3px rgb(0 0 0 / 0.5))";
        frame.className = "rounded-sm p-[3px]";
        img.alt = "";
        img.className = "block h-[42px] w-14 rounded-xs object-cover";
        // a triangle, from the top border of a box with no size
        tail.className = "-mt-px size-0 border-x-[7px] border-t-[8px] border-x-transparent";

        frame.append(img);
        element.append(frame, tail);

        const pin = { element, frame, img, tail };

        if (media) {
            img.src = getMediaTeaserUrl(media) ?? "";
        }

        stylePin(pin, false);

        return pin;
    };

    // framed in the theme's color, so what the info window is about can be picked out
    const stylePin = (pin: Pin, isHighlighted: boolean) => {
        pin.frame.classList.toggle("bg-white", !isHighlighted);
        pin.frame.classList.toggle("bg-primary", isHighlighted);
        pin.tail.classList.toggle("border-t-white", !isHighlighted);
        pin.tail.classList.toggle("border-t-primary", isHighlighted);
    };

    /*
       A cluster holding a highlighted photo is marked, and shows that photo -
       otherwise it shows its first. Zooming in on an open cluster splits it, and
       the pieces stay marked, as they hold what the info window lists.
    */
    const styleCluster = (markers: google.maps.marker.AdvancedMarkerElement[], pin: Pin) => {
        const held = markers.find(marker => highlighted.has(marker));
        const shown = mediaByMarker.get(held ?? markers[0]);

        pin.img.src = (shown && getMediaTeaserUrl(shown)) ?? "";
        stylePin(pin, !!held);
    };

    /*
       Moves the mark to what the info window now shows, or clears it. Clusters
       are restyled in place - the clusterer only redraws them when the zoom or
       the markers change.
    */
    const highlight = (markers: google.maps.marker.AdvancedMarkerElement[]) => {
        for (const marker of highlighted) {
            stylePin(pinByMarker.get(marker)!, false);
            marker.zIndex = null;
        }

        highlighted = new Set(markers);

        for (const marker of highlighted) {
            stylePin(pinByMarker.get(marker)!, true);
            // over any neighbors they overlap, though under the clusters
            marker.zIndex = 999;
        }

        for (const [clusterMarker, { markers, pin }] of clusterPins) {
            // gone from the map: a zoom since has replaced it with others
            if (!clusterMarker.map) {
                clusterPins.delete(clusterMarker);
            } else {
                styleCluster(markers, pin);
            }
        }
    };

    /*
       Photos close enough to overlap at this zoom are drawn as one: a photo
       from among them, with how many it stands for. Clicking it lists them all.
    */
    const renderCluster = (
        { count, position, markers }: Cluster,
        AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
    ) => {
        const content = document.createElement("div");
        const held = (markers ?? []) as google.maps.marker.AdvancedMarkerElement[];
        const pin = buildPin(undefined);

        styleCluster(held, pin);
        content.className = "relative";
        content.append(pin.element);

        const badge = document.createElement("span");

        badge.textContent = String(count);
        badge.className = "badge badge-sm badge-primary absolute -right-2 -top-2";
        content.append(badge);

        const clusterMarker = new AdvancedMarkerElement({
            position,
            content,
            title: `${count} photos`,
            // above the single photos it covers
            zIndex: 1000 + count
        });

        clusterPins.set(clusterMarker, { markers: held, pin });

        return clusterMarker;
    };

    const defaultMapOptions = (center: GpsCoordinate | undefined) => ({
        controlSize: 24,
        center: center ? { lat: center.latitude, lng: center.longitude } : { lat: 0, lng: 0 },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: "af11584565f27198",
        mapTypeId: props.mapState.mapType,
        zoom: center ? props.mapState.mapZoom : 2,
        // read once: a new theme makes a new map
        colorScheme:
            props.theme === ThemeDark ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT
    });

    async function initMap(initialLocation: GpsCoordinate | undefined): Promise<void> {
        const { InfoWindow, Map } = await google.maps.importLibrary("maps");

        if (el) {
            const options = defaultMapOptions(initialLocation);
            map = new Map(el, options);
            /* eslint-disable solid/reactivity -- these are event handlers, registered
               with the maps api rather than with jsx, so the rule cannot see that they
               only ever run in response to a user action */
            map.addListener("zoom_changed", () => {
                const zoom = map.getZoom();

                if (zoom !== undefined) {
                    props.setZoom(zoom);
                }
            });
            map.addListener("maptypeid_changed", () => {
                const mapType = map.getMapTypeId();

                if (mapType) {
                    props.setMapType(mapType);
                }
            });
            pathControl = buildControl("icon-[ic--round-route]", "Show trip path", () =>
                props.setShowPath(!props.mapState.mapShowPath)
            );
            /* eslint-enable solid/reactivity */
            infoWindow = new InfoWindow({ content: "" });
            // closed with its button or by the map - nothing is being shown, so nothing is marked
            infoWindow.addListener("close", () => {
                reopenWhenClustered = undefined;
                highlight([]);
            });
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
                buildControl("icon-[ic--round-zoom-out-map]", "Show all photos", fitAll)
            );
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(pathControl);

            google.maps.event.addListenerOnce(map, "idle", async () => {
                await addMarkers();
            });
        }
    }

    /*
       Frames every photo here at once - the map otherwise opens on one of them,
       at the zoom last used. A single photo has nothing to frame, so the map
       only centers on it rather than zooming as far in as it can.
    */
    const fitAll = () => {
        const positions = photoPositions();

        if (positions.length === 1) {
            map.panTo(positions[0]);
        } else if (positions.length > 1) {
            const bounds = new google.maps.LatLngBounds();

            positions.forEach(position => bounds.extend(position));
            map.fitBounds(bounds, 48);
        }
    };

    // where each photo was taken, in the category's order
    const photoPositions = () =>
        props.mediaService
            .mediaWithGps()
            .map(item => props.mediaService.preferredGpsLocation(item))
            .filter(gps => !!gps)
            .map(gps => ({ lat: gps.latitude, lng: gps.longitude }));

    // in the look of the map's own controls, which are light or dark with the map
    const buildControl = (iconClass: string, label: string, onClick: () => void) => {
        const button = document.createElement("button");
        const icon = document.createElement("span");

        icon.className = `${iconClass} align-middle text-lg`;
        button.type = "button";
        button.title = label;
        button.setAttribute("aria-label", label);
        button.className =
            props.theme === ThemeDark
                ? "m-2.5 -mb-1 flex size-6 cursor-pointer items-center justify-center rounded-xs bg-neutral-800 text-neutral-300 shadow-md hover:text-white"
                : "m-2.5 -mb-1 flex size-6 cursor-pointer items-center justify-center rounded-xs bg-white text-neutral-600 shadow-md hover:text-neutral-900";
        button.addEventListener("click", onClick);
        button.append(icon);

        return button;
    };

    /*
       The photos joined in order, with arrows for which way they went - for a
       trip, the route taken. The category's order is the order the photos
       were added to it, which is usually the order they were taken in. A
       photo taken where the last one was adds nothing, so is skipped.

       Each hop is drawn in its own color, stepping from the start of the
       gradient to its end, over one dark line beneath them all so it reads on
       pale roads and busy imagery alike. The arrows ride a line of their own
       on top - on a hop shorter than the spacing between them, they would not
       be drawn at all. Geodesic, so a long flight bends the way the route did.
    */
    let pathParts:
        | {
              lines: google.maps.Polyline[];
              ends: google.maps.marker.AdvancedMarkerElement[];
          }
        | undefined;

    const buildPath = () => {
        const path = photoPositions().filter(
            (position, i, all) =>
                i === 0 || position.lat !== all[i - 1].lat || position.lng !== all[i - 1].lng
        );

        if (path.length < 2) {
            return { lines: [], ends: [] };
        }

        const arrow = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2.5,
            fillColor: "#ffffff",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 1
        };

        const edge = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: "#000000",
            strokeOpacity: 0.6,
            strokeWeight: 6,
            zIndex: 1
        });

        const hops = pathSegmentColors(path.length - 1).map(
            (color, i) =>
                new google.maps.Polyline({
                    path: [path[i], path[i + 1]],
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWeight: 3.5,
                    zIndex: 2
                })
        );

        const arrows = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeOpacity: 0,
            icons: [{ icon: arrow, offset: "60px", repeat: "120px" }],
            zIndex: 3
        });

        return {
            lines: [edge, ...hops, arrows],
            ends: [
                buildPathEnd(
                    path[0],
                    pathStartColor,
                    "icon-[ic--round-play-arrow]",
                    "Start",
                    false
                ),
                buildPathEnd(
                    path[path.length - 1],
                    pathEndColor,
                    "icon-[ic--round-flag]",
                    "End",
                    true
                )
            ]
        };
    };

    /*
       A dot in the gradient's own color where the path begins or ends - in a
       small category, or one with most photos in one place, the colors alone
       are too subtle to tell which end is which. Centered on the spot, beneath
       the photo pins there.
    */
    const buildPathEnd = (
        position: google.maps.LatLngLiteral,
        color: string,
        iconClass: string,
        title: string,
        isLight: boolean
    ) => {
        const dot = document.createElement("div");
        const icon = document.createElement("span");

        dot.className =
            "flex size-6 items-center justify-center rounded-full border-2 border-white shadow-md shadow-black/60";
        dot.style.backgroundColor = color;
        // dark on the bright yellow, white on the blue
        icon.className = `${iconClass} text-base ${isLight ? "text-neutral-900" : "text-white"}`;
        dot.append(icon);

        return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: dot,
            title,
            anchorLeft: "-50%",
            anchorTop: "-50%",
            zIndex: -1
        });
    };

    // built the first time it is wanted, then only shown and hidden
    const showPath = (isShown: boolean) => {
        if (isShown) {
            pathParts ??= buildPath();
        }

        pathParts?.lines.forEach(line => line.setMap(isShown ? map : null));
        pathParts?.ends.forEach(end => (end.map = isShown ? map : null));

        pathControl?.setAttribute("aria-pressed", String(isShown));
        // on, in the blue the map's own controls use for a choice that is made
        pathControl?.classList.toggle("text-blue-500!", isShown);
    };

    // the toggle for the path, made with the map
    let pathControl: HTMLButtonElement | undefined;

    // a link out to google maps at this spot, for street view and the rest
    const buildGoogleMapsLink = (gps: GpsCoordinate) => {
        const link = document.createElement("a");
        const icon = document.createElement("span");

        icon.className = "icon-[ic--round-open-in-new] align-middle";
        link.href = getGoogleMapsUrl(gps);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        // a set color, not the theme's: the info window is white whatever the theme
        link.className =
            "link mt-1 flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900";
        link.append("Open in Google Maps", icon);

        return link;
    };

    // the chosen photo, with a magnifier for seeing it larger
    const buildPhotoContents = (media: Media, gps: GpsCoordinate) => {
        const container = document.createElement("div");
        const wrapper = document.createElement("div");
        const img = document.createElement("img");
        const button = document.createElement("button");
        const icon = document.createElement("span");

        wrapper.className = "relative";
        img.src = getMediaTeaserUrl(media) ?? "";
        img.alt = "";
        img.className = "block";
        icon.className = "icon-[ic--round-zoom-in] align-middle text-lg";
        button.type = "button";
        button.title = "Preview";
        button.setAttribute("aria-label", "Preview");
        button.className = "btn btn-sm btn-circle absolute bottom-1 right-1 bg-base-100/80";
        button.addEventListener("click", () => setPreviewMedia(media));
        button.append(icon);
        wrapper.append(img, button);
        container.append(wrapper, buildGoogleMapsLink(gps));

        return container;
    };

    /*
       How many thumbnails across: as many as fit in about half the map, so the
       popup leaves the map around it in view - three at the least, six at the
       most, and no more than there are photos to show.
    */
    const clusterColumns = (count: number) => {
        // an 80px thumbnail and the 4px gap beside it
        const fit = Math.floor((el?.clientWidth ?? 0) / 2 / 84);

        return Math.max(1, Math.min(count, Math.max(3, Math.min(6, fit))));
    };

    // the cluster on the map that a photo's marker has been folded into, if any
    const clusterHolding = (marker: google.maps.marker.AdvancedMarkerElement) => {
        for (const [clusterMarker, { markers }] of clusterPins) {
            if (clusterMarker.map && markers.includes(marker)) {
                return clusterMarker;
            }
        }

        return undefined;
    };

    // every photo in a cluster, any of which can be chosen as the active one
    const buildClusterContents = (cluster: Cluster) => {
        const grid = document.createElement("div");

        // no scrolling of its own - the info window already scrolls what does not fit
        grid.className = "grid gap-1";
        // a style rather than a class: tailwind only builds the grid-cols-N it sees written out
        grid.style.gridTemplateColumns = `repeat(${clusterColumns(cluster.count)}, auto)`;

        for (const marker of cluster.markers ?? []) {
            const media = mediaByMarker.get(marker as google.maps.marker.AdvancedMarkerElement);

            if (!media) {
                continue;
            }

            const button = document.createElement("button");
            const img = document.createElement("img");

            img.src = getMediaTeaserUrl(media) ?? "";
            img.alt = "";
            img.className = "block h-15 w-20 rounded-sm object-cover hover:opacity-80";
            button.type = "button";
            button.title = media.slug;
            button.className = "cursor-pointer";
            button.setAttribute("aria-label", media.slug);
            button.addEventListener("click", () =>
                props.mediaService.navigateToMedia(MediaViewMap, media)
            );
            button.append(img);
            grid.append(button);
        }

        return grid;
    };

    /*
       Its photos, listed where it stands. Not the clusterer's own zoom-to-fit:
       that throws away the zoom the user chose, and zooming in is theirs to do.
    */
    const onClusterClick = (
        _evt: google.maps.MapMouseEvent,
        cluster: Cluster,
        clusterMap: google.maps.Map
    ) => {
        // a photo still waiting to be reopened would cover this
        reopenWhenClustered = undefined;
        infoWindow.setContent(buildClusterContents(cluster));
        // anchored, so it opens above the cluster's pin rather than over it
        infoWindow.open({
            anchor: cluster.marker as google.maps.marker.AdvancedMarkerElement,
            map: clusterMap
        });
        highlight((cluster.markers ?? []) as google.maps.marker.AdvancedMarkerElement[]);
    };

    const addMarkers = async () => {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        for (const item of props.mediaService.mediaWithGps()) {
            const coord = props.mediaService.preferredGpsLocation(item);
            const position = { lat: coord!.latitude, lng: coord!.longitude };
            const pin = buildPin(item.media);
            // added to the map by the clusterer, when it is not part of a cluster
            const marker = new AdvancedMarkerElement({
                position,
                content: pin.element,
                title: item.media.slug,
                gmpClickable: true
            });

            const open = () => {
                infoWindow.setContent(buildPhotoContents(item.media, coord!));

                // a marker folded into a cluster is off the map - the cluster holding it is the anchor
                const anchor = marker.map ? marker : clusterHolding(marker);

                reopenWhenClustered = undefined;

                if (anchor) {
                    infoWindow.open({ anchor, map });
                } else {
                    infoWindow.setPosition(position);
                    infoWindow.open({ map });
                    reopenWhenClustered = open;
                }

                highlight([marker]);
            };

            // a dom event - the maps api's own addListener on markers is deprecated
            marker.addEventListener("gmp-click", open);
            openers.set(item.media.id, open);
            mediaByMarker.set(marker, item.media);
            pinByMarker.set(marker, pin);
            markers.push(marker);
        }

        clusterer = new MarkerClusterer({
            map,
            markers,
            /*
               Grouping at every zoom the map offers. Left at its default of 16,
               zooming in further draws each photo on its own - and photos taken
               in one spot then sit exactly on top of each other, the count gone.
               The clusterer stops at maxZoom itself, so one past the map's 22.
            */
            algorithm: new SuperClusterAlgorithm({ maxZoom: 23 }),
            renderer: { render: cluster => renderCluster(cluster, AdvancedMarkerElement) },
            onClusterClick
        });

        clusterer.addListener("clusteringend", () => {
            const reopen = reopenWhenClustered;

            reopenWhenClustered = undefined;
            reopen?.();
        });

        setMarkersAdded(true);
    };

    const updateMap = () => {
        if (
            props.mediaService.activeMediaGps()?.latitude &&
            props.mediaService.activeMediaGps()?.longitude
        ) {
            const pos = {
                lat: props.mediaService.activeMediaGps()!.latitude,
                lng: props.mediaService.activeMediaGps()!.longitude
            };

            map.panTo(pos);

            openers.get(props.mediaService.getActiveMedia()!.id)?.();
        }
    };

    createResource(
        () => [
            isMounted(),
            markersAdded(),
            props.mediaService.isReady(),
            props.mediaService.activeMediaGps()
        ],
        async ([isMounted, markersAdded, isReady, activeMediaGps]) => {
            if (!markersAdded && isMounted && isReady) {
                let initial = activeMediaGps as GpsCoordinate | undefined;

                initial ??=
                    props.mediaService.mediaWithGps().length > 0
                        ? props.mediaService.preferredGpsLocation(
                              props.mediaService.mediaWithGps()[0]
                          )
                        : undefined;

                await initMap(initial);
            }
        }
    );

    createEffect(() => {
        if (markersAdded()) {
            updateMap();
        }
    });

    createEffect(() => {
        if (markersAdded()) {
            showPath(props.mapState.mapShowPath);
        }
    });

    onMount(() => {
        setIsMounted(true);
    });

    return (
        <Show when={props.mediaService.isReady()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <MediaToolbar
                            view={MediaViewMap}
                            mediaService={props.mediaService}
                            slideshowService={props.slideshowService}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Inspector
                        view={MediaViewMap}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        enableCategoryTeaser={props.mediaService.canChooseCategoryTeaser()}
                        requestMoveNext={() => props.mediaService.moveNext()}
                    />
                }
            >
                <Show when={props.mediaService.mediaWithGps().length === 0}>
                    <EmptyState
                        icon="icon-[ic--round-location-off]"
                        title="Nothing here has a location"
                        detail="None of this media carries the GPS data a map needs."
                    />
                </Show>
                <div class="h-dvh w-full" ref={el} />

                <MapMediaPreview
                    media={previewMedia()}
                    onClose={() => setPreviewMedia(undefined)}
                />
            </Layout>
        </Show>
    );
};

export default ViewMap;
