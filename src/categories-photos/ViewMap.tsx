import { Component, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate, useParams } from '@solidjs/router';

import { usePhotoMapViewSettingsContext } from '../contexts/settings/PhotoMapViewSettingsContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useLayoutOptionsContext } from '../contexts/LayoutOptionsContext';
import { categoriesPhotosMap, getPhotoCategoryRoutePath } from './_routes';

import MapToolbar from './ToolbarMap';
import Toolbar from "./Toolbar";
import Layout from '../components/layout/Layout';

const ViewMap: Component = () => {
    const [layoutOptions, { showXpad, hideXpad }] = useLayoutOptionsContext();
    const [state, { setMapType, setZoom }] = usePhotoMapViewSettingsContext();
    const [photoListState, { setActiveRouteDefinition }] = usePhotoListContext();
    const navigate = useNavigate();
    const params = useParams();
    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;

    setActiveRouteDefinition(categoriesPhotosMap);

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
            map.addListener('zoom_changed', () => setZoom(map.getZoom()));
            map.addListener('maptypeid_changed', () => setMapType(map.getMapTypeId()));

            infoWindow = new InfoWindow({ content: "" });

            for(const photo of photoListState.photos) {
                if(photo.latitude && photo.longitude) {
                    const marker = new AdvancedMarkerElement({map, position: { lat: photo.latitude, lng: photo.longitude}});

                    marker.addListener("click", () => {
                        infoWindow.setContent(`<img src="${photo.imageXsUrl}" />`);
                        infoWindow.open({
                            anchor: marker,
                            map
                        });
                    });

                    markers[photo.id] = marker;
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

            map.panTo(pos);

            const marker = markers[photoListState.activePhoto.id];
            mapEvent.trigger(marker, 'click');
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

            if(!params.photoId) {
                const p = photoListState.photos.find(x => x.latitude && x.longitude);

                if(p) {
                    navigate(getPhotoCategoryRoutePath(categoriesPhotosMap, p.categoryId, p.id));
                }
            }
        }
    });

    return (
        <Layout toolbar={toolbar}>
            <div class="h-[100vh] w-[100%]" ref={el} />
        </Layout>
    );
};

export default ViewMap;
