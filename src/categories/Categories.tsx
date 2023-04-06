import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useCategoryPageSettings } from '../contexts/CategoryPageSettingsContext';

const Categories: Component = () => {
    authGuard();

    const navigate = useNavigate();
    const [settings] = useCategoryPageSettings();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Categories;
