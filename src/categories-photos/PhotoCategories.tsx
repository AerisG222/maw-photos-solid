import { useNavigate, useParams } from '@solidjs/router';
import { Component, batch, createEffect } from "solid-js";

import { authGuard } from '../auth/auth';
import { getPhotoCategoryViewPath } from './_routes';
import { usePhotoPageSettingsContext } from '../contexts/PhotoPageSettingsContext';
import { getPhotos } from '../api/api';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useCategoryContext } from '../contexts/CategoryContext';

const PhotoCategories: Component = () => {
    authGuard();

    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos }] = usePhotoListContext();
    const [settings] = usePhotoPageSettingsContext();
    const navigate = useNavigate();
    const params = useParams();
    const categoryId = parseInt(params.id);
    const photosQuery = getPhotos(categoryId);

    createEffect(() => {
        if(photosQuery.isSuccess) {
            batch(() => {
                setActivePhotoCategory(categoryId);
                setPhotos(photosQuery.data.items);
            });

            navigate(getPhotoCategoryViewPath(settings.viewMode, categoryId));
        }
    });

    return (<></>);
};

export default PhotoCategories;
