import { Component, Show, createEffect, createSignal, onMount } from "solid-js";

import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { useNavigate, useParams } from "@solidjs/router";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { CategoryMapsMediaService } from "./services/CategoryMapsMediaService";
import { MediaViewModeMap } from "./models/MediaView";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";

const ViewMap: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [initialized, setInitialized] = createSignal(false);
    const [mapReady, setMapReady] = createSignal(false);
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const gpsList = categoryMediaGpsQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMapsMediaService(
        navigate,
        params,
        MediaViewModeMap,
        cq,
        mq,
        gpsList
    );

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    let el: HTMLDivElement | undefined;

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

        for (const item of mediaService.mediaWithGps()) {
            const coord = mediaService.preferredGpsLocation(item);
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
        if (mediaService.activeMediaGps()?.latitude && mediaService.activeMediaGps()?.longitude) {
            const pos = {
                lat: mediaService.activeMediaGps()!.latitude,
                lng: mediaService.activeMediaGps()!.longitude
            };

            map.panTo(pos);

            const marker = markers.get(mediaService.getActiveMedia()!.id);
            google.maps.event.trigger(marker, "click");
        }
    };

    onMount(() => {
        initMap();
    });

    createEffect(() => {
        if (initialized() && mediaService.mediaWithGps().length > 0) {
            addMarkers();
        }
    });

    createEffect(() => {
        if (mapReady()) {
            updateMap();
        }
    });

    return (
        <Show when={mediaService.isReady()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        activeCategory={mediaService.getActiveCategory()}
                        activeMedia={mediaService.getActiveMedia()}
                    >
                        <MapToolbar
                            activeMediaIsFirst={mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={mediaService.isActiveMediaLast()}
                            moveNext={mediaService.moveNext}
                            movePrevious={mediaService.movePrevious}
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
