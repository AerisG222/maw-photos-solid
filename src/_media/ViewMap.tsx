import { Component, Show, createEffect, createResource, createSignal, onMount } from "solid-js";

import { MediaMapViewSettingsState } from "../_contexts/settings/MediaMapViewSettingsContext";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { IMapsMediaService } from "./services/IMapsMediaService";
import { GpsCoordinate } from "../_models/GpsCoordinate";
import { Uuid } from "../_models/Uuid";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";

interface Props {
    mediaService: IMapsMediaService;
    mapState: MediaMapViewSettingsState;
    setMapType: (mapType: string | undefined) => void;
    setZoom: (zoom: number | undefined) => void;
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
        zoom: center ? props.mapState.zoom : 2
    });

    async function initMap(initialLocation: GpsCoordinate | undefined): Promise<void> {
        const { InfoWindow, Map } = (await google.maps.importLibrary(
            "maps"
        )) as google.maps.MapsLibrary;

        if (el) {
            const options = defaultMapOptions(initialLocation);
            map = new Map(el, options);
            map.addListener("zoom_changed", () => props.setZoom(map.getZoom()));
            map.addListener("maptypeid_changed", () => props.setMapType(map.getMapTypeId()));
            infoWindow = new InfoWindow({ content: "" });

            google.maps.event.addListenerOnce(map, "idle", async () => {
                await addMarkers();
            });
        }
    }

    const addMarkers = async () => {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
        )) as google.maps.MarkerLibrary;

        for (const item of props.mediaService.mediaWithGps()) {
            const coord = props.mediaService.preferredGpsLocation(item);
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: coord!.latitude, lng: coord!.longitude }
            });

            marker.addListener("click", () => {
                infoWindow.setContent(`<img src="${getMediaTeaserUrl(item.media, "default")}" />`);
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
            google.maps.event.trigger(marker, "click");
        }
    };

    createResource(
        () => ({
            isMounted: isMounted(),
            markersAdded: markersAdded(),
            isReady: props.mediaService.isReady(),
            activeGps: props.mediaService.activeMediaGps()
        }),
        async ({ isMounted, markersAdded, isReady }) => {
            if (!markersAdded && isMounted && isReady) {
                let initial = props.mediaService.activeMediaGps();

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
        <Show when={() => props.mediaService.isReady()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <MapToolbar
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                        />
                    </Toolbar>
                }
            >
                <Show when={props.mediaService.mediaWithGps().length === 0}>
                    <div class="text-center p-4 text-secondary italic">
                        Sorry, we do not have GPS data for this category.
                    </div>
                </Show>
                <div class="h-screen w-full" ref={el} />
            </Layout>
        </Show>
    );
};

export default ViewMap;
