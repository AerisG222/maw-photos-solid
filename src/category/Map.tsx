import { Component, Show, createEffect } from "solid-js";
import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { useAppSettingsContext } from "../_contexts/settings/AppSettingsContext";

import { MediaViewMap } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewMap from "../_media/ViewMap";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Map: Component = () => {
    const [media, { setMapType, setMapZoom, setMapShowPath }] = useMediaSettingsContext();
    const [, { resolvedTheme }] = useAppSettingsContext();
    const { mediaService, slideshowService, isLoading, loadError, retryLoad } =
        useCategoryMapServices(MediaViewMap);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    return (
        <AsyncBoundary
            error={loadError()}
            onRetry={retryLoad}
            errorTitle="Could not load this category"
            when={!isLoading()}
            skeleton={<Loading />}
        >
            {/* a map takes its color scheme only when made, so a new theme means a new map */}
            <Show when={resolvedTheme()} keyed>
                {theme => (
                    <ViewMap
                        mediaService={mediaService}
                        slideshowService={slideshowService}
                        mapState={media}
                        theme={theme}
                        setMapType={setMapType}
                        setZoom={setMapZoom}
                        setShowPath={setMapShowPath}
                    />
                )}
            </Show>
        </AsyncBoundary>
    );
};

export default Map;
