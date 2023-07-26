import { Component, createEffect } from "solid-js";
import { useNavigate } from '@solidjs/router';

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaView, getMediaPathByView } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from '../contexts/MediaListContext';
import { MediaListModeCategory, MediaListModeRandom } from '../_models/Media';

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [categoryContext] = useCategoryContext();
    const [settings] = usePhotoPageSettingsContext();
    const [mediaContext] = useMediaListContext();

    const categoryRedirect = () => {
        const cat = categoryContext.activeCategory;

        if(cat) {
            navigate(getMediaPathByView(settings.viewMode as MediaView, cat.type, cat.id));
        }
    };

    const randomRedirect = () => {
        navigate("/random/grid");
    };

    createEffect(() => {
        switch(mediaContext.mode) {
            case MediaListModeCategory:
                categoryRedirect();
                break;
            case MediaListModeRandom:
                randomRedirect();
                break;
        }
    });

    return <></>;
};

export default Redirect;
