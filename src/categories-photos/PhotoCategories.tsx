import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPathForViewMode } from './_routes';
import { usePhotoPageSettings } from '../contexts/PhotoPageSettingsContext';

const PhotoCategories: Component = () => {
    authGuard();

    const [settings] = usePhotoPageSettings();
    const navigate = useNavigate();
    const params = useParams();

    navigate(getPathForViewMode(settings.viewMode, parseInt(params.id)));

    return (<></>);
};

export default PhotoCategories;
