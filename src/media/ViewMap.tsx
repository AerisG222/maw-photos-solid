import { Component, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { useMediaMapViewSettingsContext } from "../contexts/settings/MediaMapViewSettingsContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { useLayoutOptionsContext } from "../contexts/LayoutOptionsContext";
import { categoryMapRoute } from "./_routes";
import { Media, getMediaTeaserUrl } from "../_models/Media";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../components/layout/Layout";

const ViewMap: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const [mediaList, { getFilteredMedia, setFilter, clearFilter, setActiveRouteDefinition, navigateToItem }] = useMediaListContext();
    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;

    setActiveRouteDefinition(categoryMapRoute);

    setFilter((media: Media) => {
        if(media.latitude && media.longitude) {
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
    let mapEvent: google.maps.event;
    let infoWindow: google.maps.InfoWindow;
    const markers = new Map();

    async function initMap(): Promise<void> {
        const { event } = await google.maps.importLibrary("core");
        const { InfoWindow, Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        mapEvent = event;

        if(el) {
            map = new Map(el, defaultMapOptions);
            map.addListener("zoom_changed", () => setZoom(map.getZoom()));
            map.addListener("maptypeid_changed", () => setMapType(map.getMapTypeId()));

            infoWindow = new InfoWindow({ content: "" });

            for(const item of getFilteredMedia()) {
                const marker = new AdvancedMarkerElement({map, position: { lat: item.latitude, lng: item.longitude}});

                marker.addListener("click", () => {
                    infoWindow.setContent(`<img src="${getMediaTeaserUrl(item)}" />`);
                    infoWindow.open({
                        anchor: marker,
                        map
                    });
                });

                markers[item.id] = marker;
            }

            setInitialized(true);
        }
    }

    const updateMap = () => {
        if(mediaList.activeItem?.latitude && mediaList.activeItem?.longitude) {
            const pos = {
                lat: mediaList.activeItem?.latitude,
                lng: mediaList.activeItem?.longitude
            };

            map.panTo(pos);

            const marker = markers[mediaList.activeItem.id];
            mapEvent.trigger(marker, "click");
        }
    };

    onMount(() => {
        initMap();
    });

    hideXpad();

    onCleanup(() => {
        showXpad();
        clearFilter();
    });

    createEffect(() => {
        if(initialized()) {
            updateMap();

            // the selected item guard will ensure a default media item is selected, however,
            // that does not care if the item has gps data or not.  the check below ensures we
            // move to an item w/ gps data (if there is any)
            if(!mediaList.activeItem || !mediaList.activeItem.latitude || !mediaList.activeItem.longitude) {
                const media = getFilteredMedia();

                if(media.length > 0) {
                    navigateToItem(media[0]);
                }
            }
        }
    });

    return (
        <Show when={mediaList.activeRouteDefinition}>
            <Layout toolbar={
                <Toolbar>
                    <MapToolbar />
                </Toolbar>
            }>
                <div class="h-[100vh] w-[100%]" ref={el} />
            </Layout>
        </Show>
    );
};

export default ViewMap;
