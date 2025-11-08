import { Component, createEffect } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useCategoryServices } from './hooks/useCategoryServices';

const Redirect: Component = () => {
    const [settings] = useMediaPageSettingsContext();
    const { mediaService } = useCategoryServices(settings.view);

    createEffect(() => {
        if (mediaService.getActiveCategory()) {
            mediaService.navigateToView(settings.view);
        }
    });

    return <></>;
};

export default Redirect;
