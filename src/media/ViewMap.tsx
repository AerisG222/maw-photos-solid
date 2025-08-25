import { Component, Show, createEffect, createMemo, createSignal, onMount } from "solid-js";

import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { getMediaPathByView, MediaViewModeMap } from "./_routes";
import { Media } from "../_models/Media";
import { getMediaTeaserUrl } from "../_models/utils/MediaUtils";
import { useNavigate, useParams } from "@solidjs/router";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { GpsDetail } from "../_models/GpsDetail";
import { GpsCoordinate } from "../_models/GpsCoordinate";

import MapToolbar from "./ToolbarMap";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";

type MediaWithGps = {
    media: Media;
    gps: GpsDetail;
};

const ViewMap: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const [initialized, setInitialized] = createSignal(false);
    const [mapReady, setMapReady] = createSignal(false);
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery } = useCategoriesContext();
    const { mediaQuery } = useMediaContext();

    const activeCategory = categoryQuery(() => params.categoryId as Uuid);
    const mediaList = categoryMediaQuery(() => params.categoryId as Uuid);
    const gpsList = categoryMediaGpsQuery(() => params.categoryId as Uuid);

    createEffect(() => {
        if (!params.id && mediaList.data) {
            navigate(
                getMediaPathByView(
                    MediaViewModeMap,
                    params.categoryId as Uuid,
                    mediaList.data[0].id as Uuid
                )
            );
        }
    });

    const activeMedia = mediaQuery(() => params.id as Uuid);

    const preferredGpsLocation = (
        mediaWithGps: MediaWithGps | undefined
    ): GpsCoordinate | undefined =>
        mediaWithGps?.gps?.override ? mediaWithGps.gps.override : mediaWithGps?.gps.recorded;

    const mediaWithGps = createMemo(() => {
        if (mediaList.isSuccess && gpsList.isSuccess) {
            return gpsList.data.map(
                g =>
                    ({
                        media: mediaList.data.find(m => m.id === g.mediaId),
                        gps: g
                    }) as MediaWithGps
            );
        }

        return [];
    });

    const activeMediaGps = createMemo(() =>
        preferredGpsLocation(mediaWithGps().find(m => m.media.id === activeMedia.data?.id))
    );

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

        for (const item of mediaWithGps()) {
            const coord = preferredGpsLocation(item);
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
        if (activeMediaGps()?.latitude && activeMediaGps()?.longitude) {
            const pos = {
                lat: activeMediaGps()!.latitude,
                lng: activeMediaGps()!.longitude
            };

            map.panTo(pos);

            const marker = markers.get(activeMedia.data!.id);
            google.maps.event.trigger(marker, "click");
        }
    };

    onMount(() => {
        initMap();
    });

    createEffect(() => {
        if (initialized() && mediaWithGps().length > 0) {
            addMarkers();
        }
    });

    createEffect(() => {
        if (mapReady()) {
            updateMap();
        }
    });

    return (
        <Show when={mediaList.isSuccess}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar activeCategory={activeCategory.data} activeMedia={activeMedia.data}>
                        <MapToolbar />
                    </Toolbar>
                }
            >
                <div class="h-screen w-full" ref={el} />
            </Layout>
        </Show>
    );
};

export default ViewMap;
