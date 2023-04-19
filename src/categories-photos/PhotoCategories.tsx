import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategoryViewPath } from './_routes';
import { usePhotoPageSettings } from '../contexts/PhotoPageSettingsContext';

const PhotoCategories: Component = () => {
    authGuard();

    const [settings] = usePhotoPageSettings();
    const navigate = useNavigate();
    const params = useParams();

    navigate(getPhotoCategoryViewPath(settings.viewMode, parseInt(params.id)));

    return (<></>);
};

export default PhotoCategories;
