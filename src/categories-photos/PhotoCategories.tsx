import { Outlet, useParams } from '@solidjs/router';
import { Component, Show, batch, createEffect, createResource, onCleanup } from "solid-js";

import { getPhotos } from '../api/PhotoCategories';
import { usePhotoListContext } from '../contexts/PhotoListContext';
import { useCategoryContext } from '../contexts/CategoryContext';

import AuthGuard from '../components/auth/AuthGuard';
import { RatingServiceProvider } from '../contexts/RatingServiceContext';
import { PhotoMediaService } from '../services/PhotoMediaService';

const PhotoCategories: Component = () => {
    const [categoryState, { setActivePhotoCategory }] = useCategoryContext();
    const [photos, { setPhotos, setActivePhoto }] = usePhotoListContext();
    const params = useParams();
    const categoryId = parseInt(params.categoryId);
    const [photosResource] = createResource(categoryId, getPhotos);

    onCleanup(() => {
        setActivePhoto(undefined);
        setActivePhotoCategory(-1);
        setPhotos([]);
    });

    createEffect(() => {
        if(!photosResource.loading && !photosResource.error) {
            batch(() => {
                setActivePhotoCategory(categoryId);
                setPhotos(photosResource().items);
            });
        }

        if(params.photoId) {
            const id = parseInt(params.photoId);
            setActivePhoto(id);
        } else {
            setActivePhoto(undefined);
        }
    });

    const mediaService = new PhotoMediaService();

    return (
        <AuthGuard>
            <RatingServiceProvider svc={mediaService}>
                <Show when={photos.photos && photos.photos.length > 0}>
                    <Outlet />
                </Show>
            </RatingServiceProvider>
        </AuthGuard>
    );
};

export default PhotoCategories;
