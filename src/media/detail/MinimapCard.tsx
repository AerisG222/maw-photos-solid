import { Component, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useMediaInfoPanelSettingsContext } from "../../_contexts/settings/MediaInfoPanelSettingsContext";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { useMediaContext } from "../../_contexts/api/MediaContext";

type Props = {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
};

const MinimapCard: Component<Props> = props => {
    const { gpsQuery } = useMediaContext();
    const [infoState, { setMinimapMapType, setMinimapZoom }] = useMediaInfoPanelSettingsContext();

    const gps = gpsQuery(() => props.activeMedia!.id);
    const effectiveGps = createMemo(() =>
        gps.data?.override ? gps.data.override : gps.data?.recorded
    );

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
        if (effectiveGps) {
            const pos = {
                lat: effectiveGps()?.latitude ?? 0,
                lng: effectiveGps()?.longitude ?? 0
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
        if (initialized() && gps.data) {
            updateMap();
        }
    });

    return <div class="h-[320px] w-full" ref={el} />;
};

export default MinimapCard;
