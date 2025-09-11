import { Component, createEffect } from "solid-js";

import { MediaViewMap } from "../_models/MediaView";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { useCategoryMapServices } from "./hooks/useCategoryMapServices";

import ViewMap from "../_media/ViewMap";

const Map: Component = () => {
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const { mediaService } = useCategoryMapServices(MediaViewMap);

    createEffect(() => mediaService.navigateToFirstMediaIfNeeded());

    return (
        <ViewMap
            mediaService={mediaService}
            mapState={state}
            setMapType={setMapType}
            setZoom={setZoom}
        />
    );
};

export default Map;
