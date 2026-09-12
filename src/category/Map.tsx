import { Component, createEffect } from "solid-js";

import { MediaViewMap } from "../_models/MediaView";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewMap from "../_media/ViewMap";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import Loading from "../_components/loading/Loading";

const Map: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const { mediaService, isLoading, loadError, retryLoad } = useCategoryMapServices(MediaViewMap);

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
                mapState={state}
                setMapType={setMapType}
                setZoom={setZoom}
            />
        </AsyncBoundary>
    );
};

export default Map;
