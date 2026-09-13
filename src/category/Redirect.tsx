import { Component, createEffect } from "solid-js";

import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { useCategoryServices } from "./hooks/useCategoryServices";

const Redirect: Component = () => {
    const [settings] = useMediaSettingsContext();
    const { mediaService } = useCategoryServices(settings.view);

    createEffect(() => {
        if (mediaService.getActiveCategory()) {
            mediaService.navigateToView(settings.view);
        }
    });

    return <></>;
};

export default Redirect;
