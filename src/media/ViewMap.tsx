import { Component, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { categoryMapRoute } from "./_routes";
import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import MediaSelectedGuard from "./MediaSelectedGuard";

const ViewMap: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const [mediaList, { getFilteredMedia, setFilter, clearFilter, setActiveRouteDefinition }] =
        useMediaListContext();
    const [initialized, setInitialized] = createSignal(false);
    const [mapReady, setMapReady] = createSignal(false);

    let el: HTMLDivElement | undefined;

    setActiveRouteDefinition(categoryMapRoute);

    setFilter((media: Media) => {
        if (media?.latitude && media?.longitude) {
            return true;
        } else {
            return false;
        }
    });

    const defaultMapOptions = {
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: "af11584565f27198",
        mapTypeId: state.mapType,
        zoom: state.zoom
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
            map.addListener("zoom_changed", () => setZoom(map.getZoom()));
            map.addListener("maptypeid_changed", () => setMapType(map.getMapTypeId()));

            google.maps.event.addListenerOnce(map, "idle", () => setMapReady(true));

            infoWindow = new InfoWindow({ content: "" });

            setInitialized(true);
        }
    }

    const addMarkers = async () => {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
        )) as google.maps.MarkerLibrary;

        for (const item of getFilteredMedia()) {
            const marker = new AdvancedMarkerElement({
                map,
                position: { lat: item.latitude, lng: item.longitude }
            });

            marker.addListener("click", () => {
                infoWindow.setContent(`<img src="${getMediaTeaserUrl(item, "default")}" />`);
                infoWindow.open({
                    anchor: marker,
                    map
                });
            });

            markers[item.id] = marker;
        }
    };

    const updateMap = () => {
        if (mediaList.activeItem?.latitude && mediaList.activeItem?.longitude) {
            const pos = {
                lat: mediaList.activeItem?.latitude,
                lng: mediaList.activeItem?.longitude
            };

            map.panTo(pos);

            const marker = markers[mediaList.activeItem.id];
            google.maps.event.trigger(marker, "click");
        }
    };

    onMount(() => {
        initMap();
    });

    onCleanup(() => {
        clearFilter();
    });

    createEffect(() => {
        if (initialized() && getFilteredMedia().length > 0) {
            addMarkers();
        }
    });

    createEffect(() => {
        if (mapReady()) {
            updateMap();
        }
    });

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <MediaSelectedGuard targetRoute={mediaList.activeRouteDefinition}>
                <Layout
                    xPad={false}
                    toolbar={
                        <Toolbar>
                            <MapToolbar />
                        </Toolbar>
                    }
                >
                    <div class="h-screen w-full" ref={el} />
                </Layout>
            </MediaSelectedGuard>
        </Show>
    );
};

export default ViewMap;
