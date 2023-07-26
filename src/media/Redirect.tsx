import { Component, createEffect } from "solid-js";
import { useNavigate } from '@solidjs/router';

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaView, getMediaPathByView } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { AreaCategories, AreaRandom } from '../_models/AppRouteDefinition';

const Redirect: Component = () => {
    const navigate = useNavigate();
    const [categoryContext] = useCategoryContext();
    const [settings] = usePhotoPageSettingsContext();
    const [routeContext] = useRouteDetailContext();

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
        switch(routeContext.area) {
            case AreaCategories:
                categoryRedirect();
                break;
            case AreaRandom:
                randomRedirect();
                break;
        }
    });

    return <></>;
};

export default Redirect;
