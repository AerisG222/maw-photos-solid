import { Outlet, useParams } from '@solidjs/router';
import { Component, batch, createEffect } from "solid-js";

import { getPhotos } from '../api/api';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useCategoryContext } from '../contexts/CategoryContext';

import AuthGuard from '../components/auth/AuthGuard';

const PhotoCategories: Component = () => {
    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos }] = usePhotoListContext();
    const params = useParams();
    const categoryId = parseInt(params.id);
    const photosQuery = getPhotos(categoryId);

    createEffect(() => {
        if(photosQuery.isSuccess) {
            batch(() => {
                setActivePhotoCategory(categoryId);
                setPhotos(photosQuery.data.items);
            });
        }
    });

    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default PhotoCategories;
