import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';
import { usePhotoMapViewSettingsContext } from '../contexts/settings/PhotoMapViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';

const ViewMap: Component = () => {
    const [layoutOptions, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [state, { setMapType, setZoom }] = usePhotoMapViewSettingsContext();
    const [photoListState] = usePhotoListContext();
    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;

    const toolbar = (
        <Toolbar>
            <MapToolbar />
        </Toolbar>
    );

    const defaultMapOptions = {
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: true,
        mapTypeControl: true,
        mapId: 'af11584565f27198',
        mapTypeId: state.mapType,
        zoom: state.zoom
    };

    let map: google.maps.Map;
    const markers: google.maps.AdvancedMarkerElement[] = [];

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        if(el) {
            map = new Map(el, defaultMapOptions);
            map.addListener('zoom_changed', () => setZoom(map.getZoom()));
            map.addListener('maptypeid_changed', () => setMapType(map.getMapTypeId()));

            for(const photo of photoListState.photos) {
                if(photo.latitude && photo.longitude) {
                    markers.push(new AdvancedMarkerElement({map, position: { lat: photo.latitude, lng: photo.longitude}}));
                }
            }

            setInitialized(true);
        }
    }

    const updateMap = () => {
        if(photoListState.activePhoto?.latitude && photoListState.activePhoto?.longitude) {
            const pos = {
                lat: photoListState.activePhoto?.latitude,
                lng: photoListState.activePhoto?.longitude
            };

            map.setCenter(pos);
        }
    }

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
        }
    });

    return (
        <Layout toolbar={toolbar}>
            <div class="h-[100vh] w-[100%]" ref={el} />
        </Layout>
    );
};

export default ViewMap;
