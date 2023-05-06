import { Outlet, useParams } from '@solidjs/router';
import { Component, Show, batch, createEffect, onCleanup } from "solid-js";

import { getPhotos } from '../api/PhotoCategories';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useCategoryContext } from '../contexts/CategoryContext';

import AuthGuard from '../components/auth/AuthGuard';

const PhotoCategories: Component = () => {
    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos, setActivePhoto }] = usePhotoListContext();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);
    const photosQuery = getPhotos(categoryId);

    onCleanup(() => {
        setActivePhoto(undefined);
        setActivePhotoCategory(-1);
        setPhotos([]);
    });

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
            <Show when={photos.photos && photos.photos.length > 0}>
                <Outlet />
            </Show>
        </AuthGuard>
    );
};

export default PhotoCategories;
