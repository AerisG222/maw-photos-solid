import { Component, createEffect, createSignal, onMount } from "solid-js";
import { useMediaInfoPanelSettingsContext } from "../../_contexts/settings/MediaInfoPanelSettingsContext";
import { useMediaListContext } from "../contexts/MediaListContext";

const MinimapCard: Component = () => {
    const [infoState, { setMinimapMapType, setMinimapZoom }] = useMediaInfoPanelSettingsContext();
    const [mediaList] = useMediaListContext();

    const defaultMapOptions = {
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: false,
        mapTypeControl: true,
        mapId: "dd8322a8b42d6496",
        mapTypeId: infoState.minimapMapType,
        zoom: infoState.minimapZoom
    };

    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;
    let map: google.maps.Map;
    let marker: google.maps.AdvancedMarkerElement;

    async function initMap(): Promise<void> {
        const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
        )) as google.maps.MarkerLibrary;

        if (el) {
            map = new Map(el, defaultMapOptions);
            map.addListener("zoom_changed", () => setMinimapZoom(map.getZoom()));
            map.addListener("maptypeid_changed", () => setMinimapMapType(map.getMapTypeId()));

            marker = new AdvancedMarkerElement({ map, position: defaultMapOptions.center });

            setInitialized(true);
        }
    }

    const updateMap = () => {
        if (mediaList.activeItem?.latitude && mediaList.activeItem?.longitude) {
            const pos = {
                lat: mediaList.activeItem?.latitude,
                lng: mediaList.activeItem?.longitude
            };

            map.setCenter(pos);
            marker.position = pos;

            el.style.visibility = "visible";
        } else {
            el.style.visibility = "hidden";
            marker.position = null;
        }
    };

    onMount(() => {
        initMap();
    });

    createEffect(() => {
        if (initialized()) {
            updateMap();
        }
    });

    return <div class="h-[320px] w-full" ref={el} />;
};

export default MinimapCard;
