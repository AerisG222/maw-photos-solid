import { useLocation, useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useCategoryPageSettingsContext } from '../contexts/CategoryPageSettingsContext';

const CategoriesRedirect: Component = () => {
    authGuard();

    const location = useLocation();
    const navigate = useNavigate();
    const [settings] = useCategoryPageSettingsContext();

    if(location.pathname.endsWith('/categories')) {
        navigate(getPathForViewMode(settings.viewMode));
    }

    return <></>;
};

export default CategoriesRedirect;
