import { Component, createEffect, Match, Switch } from "solid-js";

import { MediaViewMap } from "../_models/MediaView";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewMap from "../_media/ViewMap";
import ErrorMessage from "../_components/error/ErrorMessage";
import Loading from "../_components/loading/Loading";

const Map: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const { mediaService, isLoading, loadError, retryLoad } = useCategoryMapServices(MediaViewMap);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    return (
        <Switch fallback={<Loading />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load this category"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={!isLoading()}>
                <ViewMap
                    mediaService={mediaService}
                    mapState={state}
                    setMapType={setMapType}
                    setZoom={setZoom}
                />
            </Match>
        </Switch>
    );
};

export default Map;
