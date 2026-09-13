import { Component, createEffect } from "solid-js";
import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";

import { MediaViewMap } from "../_models/MediaView";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewMap from "../_media/ViewMap";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Map: Component = () => {
    const [media, { setMapType, setMapZoom }] = useMediaSettingsContext();
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
            <ViewMap
                mediaService={mediaService}
                slideshowService={slideshowService}
                mapState={media}
                setMapType={setMapType}
                setZoom={setMapZoom}
            />
        </AsyncBoundary>
    );
};

export default Map;
