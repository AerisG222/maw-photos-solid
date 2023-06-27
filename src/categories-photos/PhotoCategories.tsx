import { Outlet, useParams } from '@solidjs/router';
import { Component } from "solid-js";

import { PhotoListProvider } from '../contexts/PhotoListContext';
import { RatingServiceProvider } from '../contexts/RatingServiceContext';
import { PhotoMediaService } from '../api/PhotoMediaService';
import { CommentServiceProvider } from '../contexts/CommentServiceContext';
import { ExifServiceProvider } from '../contexts/ExifServiceContext';
import { CategoryTeaserServiceProvider } from '../contexts/CategoryTeaserServiceContext';
import { MetadataEditServiceProvider } from '../contexts/MetadataEditServiceContext';
import { PhotoEffectsProvider } from '../contexts/PhotoEffectsContext';
import { SlideshowProvider } from '../contexts/SlideshowContext';

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
            <SlideshowProvider>
            <PhotoEffectsProvider>
            <RatingServiceProvider svc={mediaService}>
            <CommentServiceProvider svc={mediaService}>
            <ExifServiceProvider svc={mediaService}>
            <MetadataEditServiceProvider svc={mediaService}>
            <CategoryTeaserServiceProvider svc={mediaService}>
                <Outlet />
            </CategoryTeaserServiceProvider>
            </MetadataEditServiceProvider>
            </ExifServiceProvider>
            </CommentServiceProvider>
            </RatingServiceProvider>
            </PhotoEffectsProvider>
            </SlideshowProvider>
            </PhotoLoader>
            </PhotoListProvider>
        </AuthGuard>
    );
};

export default PhotoCategories;
