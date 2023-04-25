import { Outlet, useParams } from '@solidjs/router';
import { Component, batch, createEffect } from "solid-js";

import { getPhotos } from '../api/api';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useCategoryContext } from '../contexts/CategoryContext';

import AuthGuard from '../components/auth/AuthGuard';

const PhotoCategories: Component = () => {
    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos, setActivePhoto }] = usePhotoListContext();
    const params = useParams();
    const categoryId = parseInt(params.id);
    const photoId = parseInt(params.photoId);
    const photosQuery = getPhotos(categoryId);

    createEffect(() => {
        if(photosQuery.isSuccess) {
            batch(() => {
                setActivePhotoCategory(categoryId);
                setPhotos(photosQuery.data.items);
            });
        }

        if(params.photoId) {
            const id = parseInt(params.photoId);
            setActivePhoto(id);
        } else {
            setActivePhoto(undefined);
        }
    });

    return (
        <AuthGuard>
            <Outlet />
        </AuthGuard>
    );
};

export default PhotoCategories;
