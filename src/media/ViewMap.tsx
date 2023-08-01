import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaMapViewSettingsContext } from "../contexts/settings/MediaMapViewSettingsContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { useLayoutOptionsContext } from "../contexts/LayoutOptionsContext";
import { getMediaPath, categoryMapRoute } from "./_routes";
import { CategoryType } from "../_models/CategoryType";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../components/layout/Layout";
import { getMediaTeaserUrl } from "../_models/Media";

const ViewMap: Component = () => {
    const [, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const [mediaList, { setActiveRouteDefinition }] = useMediaListContext();
    const navigate = useNavigate();
    const params = useParams();
    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;

    setActiveRouteDefinition(categoryMapRoute);

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

            for(const item of mediaList.items) {
                if(item.latitude && item.longitude) {
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
    });

    createEffect(() => {
        if(initialized()) {
            updateMap();

            if(!params.id) {
                const p = mediaList.items.find(x => x.latitude && x.longitude);

                if(p) {
                    navigate(getMediaPath(categoryMapRoute, params.categoryType as CategoryType, p.categoryId, p.id));
                }
            }
        }
    });

    return (
        <Layout toolbar={
            <Toolbar>
                <MapToolbar />
            </Toolbar>
        }>
            <div class="h-[100vh] w-[100%]" ref={el} />
        </Layout>
    );
};

export default ViewMap;
