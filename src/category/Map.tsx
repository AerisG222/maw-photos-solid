import { useNavigate, useParams } from "@solidjs/router";
import { Component, createEffect } from "solid-js";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useMediaMapViewSettingsContext } from "../_contexts/settings/MediaMapViewSettingsContext";
import { MediaViewModeMap } from "../media/models/MediaView";
import { CategoryMapsMediaService } from "../media/services/CategoryMapsMediaService";

import ViewMap from "../media/ViewMap";

const Map: Component = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [state, { setMapType, setZoom }] = useMediaMapViewSettingsContext();
    const { categoryQuery, categoryMediaQuery, categoryMediaGpsQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const gpsList = categoryMediaGpsQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMapsMediaService(
        navigate,
        params,
        MediaViewModeMap,
        cq,
        mq,
        gpsList
    );

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
