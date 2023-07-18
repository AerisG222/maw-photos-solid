import { Component, createEffect } from "solid-js";
import { useNavigate } from '@solidjs/router';

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaView, getMediaPathByView } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [categoryContext] = useCategoryContext();
    const [settings] = usePhotoPageSettingsContext();

    createEffect(() => {
        const cat = categoryContext.activeCategory;

        if(cat) {
            navigate(getMediaPathByView(settings.viewMode as MediaView, cat.type, cat.id));
        }
    });

    return <></>;
};

export default Redirect;
