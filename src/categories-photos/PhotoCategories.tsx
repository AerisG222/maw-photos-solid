import { Outlet, useParams } from '@solidjs/router';
import { Component, Show } from "solid-js";

import { PhotoListProvider } from '../contexts/PhotoListContext';
import { RatingServiceProvider } from '../contexts/RatingServiceContext';
import { PhotoMediaService } from '../api/PhotoMediaService';
import { CommentServiceProvider } from '../contexts/CommentServiceContext';
import { ExifServiceProvider } from '../contexts/ExifServiceContext';
import { CategoryTeaserServiceProvider } from '../contexts/CategoryTeaserServiceContext';
import { MetadataEditServiceProvider } from '../contexts/MetadataEditServiceContext';
import { PhotoEffectsProvider } from '../contexts/PhotoEffectsContext';

import AuthGuard from '../components/auth/AuthGuard';
import PhotoLoader from './PhotoLoader';

const PhotoCategories: Component = () => {
    const params = useParams();
    const mediaService = new PhotoMediaService();

    return (
        <AuthGuard>
            <PhotoListProvider>
            <PhotoLoader
                categoryId={parseInt(params.categoryId, 10)}
                photoId={params.photoId ? parseInt(params.photoId, 10) : undefined}>
            <PhotoEffectsProvider>
            <RatingServiceProvider svc={mediaService}>
            <CommentServiceProvider svc={mediaService}>
            <ExifServiceProvider svc={mediaService}>
            <MetadataEditServiceProvider svc={mediaService}>
            <CategoryTeaserServiceProvider svc={mediaService}>
                {/* <Show when={photos.photos && photos.photos.length > 0}> */}
                    <Outlet />
                {/* </Show> */}
            </CategoryTeaserServiceProvider>
            </MetadataEditServiceProvider>
            </ExifServiceProvider>
            </CommentServiceProvider>
            </RatingServiceProvider>
            </PhotoEffectsProvider>
            </PhotoLoader>
            </PhotoListProvider>
        </AuthGuard>
    );
};

export default PhotoCategories;
