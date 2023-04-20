import { useNavigate } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { useCategoryPageSettingsContext } from '../contexts/CategoryPageSettingsContext';

const Categories: Component = () => {
    authGuard();

    const navigate = useNavigate();
    const [settings] = useCategoryPageSettingsContext();

    navigate(getPathForViewMode(settings.viewMode));

    return (<></>);
};

export default Categories;
