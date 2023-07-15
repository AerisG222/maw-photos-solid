import { useNavigate, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaView, getMediaPathByView } from './_routes';
import { CategoryTypePhotos } from '../_models/CategoryType';

const PhotoCategoriesRedirect: Component = () => {
    const [settings] = usePhotoPageSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);

    navigate(getMediaPathByView(settings.viewMode as MediaView, CategoryTypePhotos, categoryId));

    return <></>;
};

export default PhotoCategoriesRedirect;
