import {
    Component,
    createEffect,
    createMemo,
    createResource,
    createSignal,
    onMount,
    Show
} from "solid-js";
import { Category } from "../../_models/Category";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";
import { ResolvedThemeIdType, ThemeDark } from "../../_models/Theme";
import { Media } from "../../_models/Media";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import { getGoogleMapsUrl } from "../../_models/utils/GpsUtils";

import Icon from "../../_components/icon/Icon";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
}

// a map takes its color scheme only when made, so a new theme means a new map
const MinimapCard: Component<Props> = props => {
    const [, { resolvedTheme }] = useAppSettingsContext();

    return (
        <Show when={resolvedTheme()} keyed>
            {theme => (
                <Minimap
                    activeCategory={props.activeCategory}
                    activeMedia={props.activeMedia}
                    theme={theme}
                />
            )}
        </Show>
    );
};

const Minimap: Component<Props & { theme: ResolvedThemeIdType }> = props => {
    const [isMounted, setIsMounted] = createSignal(false);
    const { gpsQuery } = useMediaContext();
    const [media, { setMapType, setMapZoom }] = useMediaSettingsContext();

    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const gps = gpsQuery(() => props.activeMedia!.id);
    const effectiveGps = createMemo(() => gps.data?.override ?? gps.data?.recorded);

    // made once the maps api has loaded, as the color scheme is one of its values
    const defaultMapOptions = () => ({
        controlSize: 24,
        center: { lat: 0, lng: 0 },
        fullscreenControl: false,
        mapTypeControl: true,
        mapId: "dd8322a8b42d6496",
        mapTypeId: media.mapType,
        zoom: media.mapZoom,
        // read once: a new theme makes a new map
        colorScheme:
            props.theme === ThemeDark ? google.maps.ColorScheme.DARK : google.maps.ColorScheme.LIGHT
    });

    const [initialized, setInitialized] = createSignal(false);
    let el: HTMLDivElement | undefined;
    let map: google.maps.Map;
    let marker: google.maps.marker.AdvancedMarkerElement;

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        if (el) {
            const options = defaultMapOptions();

            map = new Map(el, options);
            map.addListener("zoom_changed", () => {
                const zoom = map.getZoom();

                if (zoom !== undefined) {
                    setMapZoom(zoom);
                }
            });
            map.addListener("maptypeid_changed", () => {
                const mapType = map.getMapTypeId();

                if (mapType) {
                    setMapType(mapType);
                }
            });

            marker = new AdvancedMarkerElement({ map, position: options.center });

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

            if (el) {
                el.style.visibility = "visible";
            }
        } else {
            if (el) {
                el.style.visibility = "hidden";
            }
            marker.position = null;
        }
    };

    createResource(isMounted, async () => {
        if (isMounted()) {
            await initMap();
        }
    });

    createEffect(() => {
        if (initialized() && gps.data) {
            updateMap();
        }
    });

    onMount(() => {
        setIsMounted(true);
    });

    return (
        <>
            <div class="h-[320px] w-full" ref={el} />

            {/* google maps itself, for street view, directions and the rest */}
            <Show when={effectiveGps()}>
                {gps => (
                    <a
                        href={getGoogleMapsUrl(gps())}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link link-primary mt-2 inline-flex items-center gap-1 text-sm"
                    >
                        Open in Google Maps
                        <Icon classes="icon-[ic--round-open-in-new]" />
                    </a>
                )}
            </Show>
        </>
    );
};

export default MinimapCard;
