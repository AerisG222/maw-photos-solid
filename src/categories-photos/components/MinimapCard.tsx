import { Component, createEffect, createSignal, onMount } from 'solid-js';
import { usePhotoInfoPanelSettingsContext } from '../../contexts/PhotoInfoPanelSettingsContext';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

const MinimapCard: Component = () => {
    const [infoState, { setMinimapMapType, setMinimapZoom } ] = usePhotoInfoPanelSettingsContext();
    const [photoListState] = usePhotoListContext();

    const defaultMapOptions = {
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: false,
        mapTypeControl: true,
        mapId: 'dd8322a8b42d6496',
        mapTypeId: infoState.minimapMapType,
        zoom: infoState.minimapZoom
    };

    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;
    let map: google.maps.Map;
    let marker: google.maps.AdvancedMarkerElement;

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        if(el) {
            map = new Map(el, defaultMapOptions);
            map.addListener('zoom_changed', () => setMinimapZoom(map.getZoom()));
            map.addListener('maptypeid_changed', () => setMinimapMapType(map.getMapTypeId()));

            marker = new AdvancedMarkerElement({map, position: defaultMapOptions.center});

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
            marker.position = pos;

            el.style.visibility = 'visible';
        } else {
            el.style.visibility = 'hidden';
            marker.position = null;
        }
    }

    onMount(() => {
        initMap();
    });

    createEffect(() => {
        if(initialized()) {
            updateMap();
        }
    });

    return (
        <div class="h-[320px] w-[100%]" ref={el} />
    );
}

export default MinimapCard;
