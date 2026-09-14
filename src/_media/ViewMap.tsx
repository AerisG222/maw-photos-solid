import { Component, Show, createEffect, createResource, createSignal, onMount } from "solid-js";
import { MapTypeIdType } from "../_models/MapType";
import { MapZoomLevelIdType } from "../_models/MapZoomLevel";

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
    const markers = new Map<Uuid, unknown>();

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

    const addMarkers = async () => {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        for (const item of props.mediaService.mediaWithGps()) {
            const coord = props.mediaService.preferredGpsLocation(item);
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: coord!.latitude, lng: coord!.longitude },
                gmpClickable: true
            });

            marker.addListener("gmp-click", () => {
                infoWindow.setContent(`<img src="${getMediaTeaserUrl(item.media)}" alt="" />`);
                infoWindow.open({
                    anchor: marker,
                    map
                });
            });

            markers.set(item.media.id, marker);
        }

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

            const marker = markers.get(props.mediaService.getActiveMedia()!.id);

            if (marker) {
                google.maps.event.trigger(marker, "gmp-click");
            }
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
            </Layout>
        </Show>
    );
};

export default ViewMap;
