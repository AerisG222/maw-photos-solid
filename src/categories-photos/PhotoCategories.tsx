import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getRouteForViewMode } from './_routes';
import { usePhotoPageSettings } from '../contexts/PhotoPageSettingsContext';
import { buildPath } from '../models/AppRouteDefinition';

const PhotoCategories: Component = () => {
    authGuard();

    const [settings] = usePhotoPageSettings();
    const navigate = useNavigate();
    const params = useParams();

    navigate(buildPath(getRouteForViewMode(settings.viewMode), params));

    return (<></>);
};

export default PhotoCategories;
