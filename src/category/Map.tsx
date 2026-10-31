import { Component, Show, createEffect } from "solid-js";
import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { useAppSettingsContext } from "../_contexts/settings/AppSettingsContext";

import { MediaViewMap } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";
import { useCategoryMediaFilters } from "./hooks/useCategoryMediaFilters";
import CategoryFilterMenu from "./components/CategoryFilterMenu";

import ViewMap from "../_media/ViewMap";

const Map: Component = () => {
    const [media, { setMapType, setMapZoom, setMapShowPath }] = useMediaSettingsContext();
    const [, { resolvedTheme }] = useAppSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryMapServices(MediaViewMap);

    const { filters } = useCategoryMediaFilters();

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    return (
        <>
            {/*
                A map takes its color scheme only when made, and its markers once,
                when it first has them - so a new theme or a new set of filters is a
                new map.
            */}
            <Show when={`${resolvedTheme()}|${filters().f ?? ""}|${filters().t ?? ""}`} keyed>
                {_ => (
                    <ViewMap
                        mediaService={mediaService}
                        slideshowService={slideshowService}
                        mapState={media}
                        theme={resolvedTheme()}
                        setMapType={setMapType}
                        setZoom={setMapZoom}
                        setShowPath={setMapShowPath}
                        isLoading={isLoading()}
                        loadError={loadError()}
                        onRetry={retryLoad}
                    />
                )}
            </Show>

            {/*
                Floated over the map, which has no header row to hold it, and out
                here so a new map does not take an open menu with it. Below the
                navigation on a phone, where that runs along the top.
            */}
            <div class="fixed top-16 left-1/2 z-20 -translate-x-1/2 md:top-2">
                <CategoryFilterMenu />
            </div>
        </>
    );
};

export default Map;
