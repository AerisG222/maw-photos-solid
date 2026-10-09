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

import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
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

interface Props {
    mediaService: IMapsMediaService;
    slideshowService: SlideshowService;
    mapState: { mapType: MapTypeIdType; mapZoom: MapZoomLevelIdType };
    setMapType: (mapType: string) => void;
    setZoom: (zoom: number) => void;
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
    let clusterer: MarkerClusterer | undefined;
    // the photo shown large over the map, from the magnifier on its info window
    const [previewMedia, setPreviewMedia] = createSignal<Media>();

    onCleanup(() => clusterer?.setMap(null));

    // a small thumbnail in place of a pin - the photo itself says what is there
    const buildThumbnail = (media: Media) => {
        const img = document.createElement("img");

        img.src = getMediaTeaserUrl(media) ?? "";
        img.alt = "";
        img.className =
            "block h-9 w-12 rounded-sm border-2 border-white object-cover shadow-md shadow-black/50";

        return img;
    };

    /*
       Photos close enough to overlap at this zoom are drawn as one: the first
       of them, with how many it stands for. Clicking it lists them all.
    */
    const renderCluster = (
        { count, position, markers }: Cluster,
        AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
    ) => {
        const content = document.createElement("div");
        const first = mediaByMarker.get(markers?.[0] as google.maps.marker.AdvancedMarkerElement);

        content.className = "relative";

        if (first) {
            content.append(buildThumbnail(first));
        }

        const badge = document.createElement("span");

        badge.textContent = String(count);
        badge.className =
            "badge badge-sm badge-primary absolute -right-2 -top-2 shadow-md shadow-black/50";
        content.append(badge);

        return new AdvancedMarkerElement({
            position,
            content,
            title: `${count} photos`,
            // above the single photos it covers
            zIndex: 1000 + count
        });
    };

    const defaultMapOptions = (center: GpsCoordinate | undefined) => ({
        controlSize: 24,
        center: center ? { lat: center.latitude, lng: center.longitude } : { lat: 0, lng: 0 },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: "af11584565f27198",
        mapTypeId: props.mapState.mapType,
        zoom: center ? props.mapState.mapZoom : 2
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
            /* eslint-enable solid/reactivity */
            infoWindow = new InfoWindow({ content: "" });

            google.maps.event.addListenerOnce(map, "idle", async () => {
                await addMarkers();
            });
        }
    }

    // the chosen photo, with a magnifier for seeing it larger
    const buildPhotoContents = (media: Media) => {
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

        return wrapper;
    };

    // every photo in a cluster, any of which can be chosen as the active one
    const buildClusterContents = (cluster: Cluster) => {
        const grid = document.createElement("div");

        // no scrolling of its own - the info window already scrolls what does not fit
        grid.className = "grid grid-cols-3 gap-1";

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
        infoWindow.setContent(buildClusterContents(cluster));
        infoWindow.setPosition(cluster.position);
        infoWindow.open({ map: clusterMap });
    };

    const addMarkers = async () => {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        for (const item of props.mediaService.mediaWithGps()) {
            const coord = props.mediaService.preferredGpsLocation(item);
            const position = { lat: coord!.latitude, lng: coord!.longitude };
            // added to the map by the clusterer, when it is not part of a cluster
            const marker = new AdvancedMarkerElement({
                position,
                content: buildThumbnail(item.media),
                title: item.media.slug,
                gmpClickable: true
            });

            const open = () => {
                infoWindow.setContent(buildPhotoContents(item.media));

                // a marker folded into a cluster is off the map, with nothing to anchor to
                if (marker.map) {
                    infoWindow.open({ anchor: marker, map });
                } else {
                    infoWindow.setPosition(position);
                    infoWindow.open({ map });
                }
            };

            // a dom event - the maps api's own addListener on markers is deprecated
            marker.addEventListener("gmp-click", open);
            openers.set(item.media.id, open);
            mediaByMarker.set(marker, item.media);
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
