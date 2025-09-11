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

    const defaultMapOptions = (center: GpsCoordinate) => ({
        controlSize: 24,
        center: { lat: center.latitude, lng: center.longitude },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: "af11584565f27198",
        mapTypeId: props.mapState.mapType,
        zoom: props.mapState.zoom
    });

    async function initMap(initialLocation: GpsCoordinate): Promise<void> {
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
                const initial =
                    props.mediaService.activeMediaGps() ??
                    props.mediaService.preferredGpsLocation(props.mediaService.mediaWithGps()[0]);

                if (initial) {
                    await initMap(initial);
                }
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
                <div class="h-screen w-full" ref={el} />
            </Layout>
        </Show>
    );
};

export default ViewMap;
