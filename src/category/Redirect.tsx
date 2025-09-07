import { Component, createEffect } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { CategoryMediaService } from "./services/CategoryMediaService";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { Uuid } from "../_models/Uuid";

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [settings] = useMediaPageSettingsContext();
    const params = useParams();

    const { categoryQuery, categoryMediaQuery } = useCategoriesContext();

    const cq = categoryQuery(() => params.categoryId as Uuid);
    const mq = categoryMediaQuery(() => params.categoryId as Uuid);
    const mediaService = new CategoryMediaService(navigate, params, settings.view, cq, mq);

    createEffect(() => {
        if (mediaService.getActiveCategory()) {
            mediaService.navigateToView(settings.view);
        }
    });

    return <></>;
};

export default Redirect;
