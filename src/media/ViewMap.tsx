import { Component, Show, createEffect, createSignal, onMount } from "solid-js";

import { MediaMapViewSettingsState } from "../_contexts/settings/MediaMapViewSettingsContext";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { IMapsMediaService } from "./services/IMapsMediaService";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";

type Props = {
    mediaService: IMapsMediaService;
    mapState: MediaMapViewSettingsState;
    setMapType: (mapType: string | undefined) => void;
    setZoom: (zoom: number | undefined) => void;
};

const ViewMap: Component<Props> = props => {
    const [initialized, setInitialized] = createSignal(false);
    const [mapReady, setMapReady] = createSignal(false);
    let el: HTMLDivElement | undefined;

    const defaultMapOptions = {
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: "af11584565f27198",
        mapTypeId: props.mapState.mapType,
        zoom: props.mapState.zoom
    };

    let map: google.maps.Map;
    let infoWindow: google.maps.InfoWindow;
    const markers = new Map();

    async function initMap(): Promise<void> {
        const { InfoWindow, Map } = (await google.maps.importLibrary(
            "maps"
        )) as google.maps.MapsLibrary;

        if (el) {
            map = new Map(el, defaultMapOptions);
            map.addListener("zoom_changed", () => props.setZoom(map.getZoom()));
            map.addListener("maptypeid_changed", () => props.setMapType(map.getMapTypeId()));

            google.maps.event.addListenerOnce(map, "idle", () => setMapReady(true));

            infoWindow = new InfoWindow({ content: "" });

            setInitialized(true);
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

    onMount(() => {
        initMap();
    });

    createEffect(() => {
        if (initialized() && props.mediaService.mediaWithGps().length > 0) {
            addMarkers();
        }
    });

    createEffect(() => {
        if (mapReady()) {
            updateMap();
        }
    });

    return (
        <Show when={props.mediaService.isReady()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <MapToolbar
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            moveNext={props.mediaService.moveNext}
                            movePrevious={props.mediaService.movePrevious}
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
