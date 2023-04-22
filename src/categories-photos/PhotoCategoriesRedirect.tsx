import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { getPhotoCategoryViewPath } from './_routes';
import { usePhotoPageSettingsContext } from '../contexts/PhotoPageSettingsContext';

const PhotoCategoriesRedirect: Component = () => {
    const [settings] = usePhotoPageSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.id);

    navigate(getPhotoCategoryViewPath(settings.viewMode, categoryId));

    return <></>;
};

export default PhotoCategoriesRedirect;
