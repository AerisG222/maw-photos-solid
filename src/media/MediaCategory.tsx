import { Outlet, useParams } from '@solidjs/router';
import { Component, createEffect } from 'solid-js';

import { MediaListProvider } from '../contexts/MediaListContext';
import { useCategoryContext } from '../contexts/CategoryContext';
import { CategoryType } from '../_models/CategoryType';
import { SlideshowProvider } from '../contexts/SlideshowContext';
import { VisualEffectsProvider } from '../contexts/VisualEffectsContext';
import { CategoryTeaserServiceProvider } from '../contexts/CategoryTeaserServiceContext';
import { CommentServiceProvider } from '../contexts/CommentServiceContext';
import { ExifServiceProvider } from '../contexts/ExifServiceContext';
import { MetadataEditServiceProvider } from '../contexts/MetadataEditServiceContext';
import { RatingServiceProvider } from '../contexts/RatingServiceContext';
import { PhotoMediaService } from '../_services/media/PhotoMediaService';
import { VideoMediaService } from '../_services/media/VideoMediaService';

import AuthGuard from '../components/auth/AuthGuard';
import MediaLoader from './MediaLoader';
import ActiveMediaItem from './ActiveMediaItem';

const MediaCategory: Component = () => {
    const params = useParams();
    const [, {setActiveCategoryById}] = useCategoryContext();

    // todo: correct how contexts get this service based on active media type
    const photoMediaService = new PhotoMediaService();
    const videoMediaService = new VideoMediaService();

    createEffect(() => {
        setActiveCategoryById(params.categoryType as CategoryType, parseInt(params.categoryId, 10));
    });

    return (
        <AuthGuard>
            <MediaListProvider>
            <MediaLoader>
            <ActiveMediaItem>
            <SlideshowProvider>
            <VisualEffectsProvider>
            <ExifServiceProvider svc={photoMediaService}>
            <RatingServiceProvider svc={photoMediaService}>
            <CommentServiceProvider svc={photoMediaService}>
            <MetadataEditServiceProvider svc={photoMediaService}>
            <CategoryTeaserServiceProvider svc={photoMediaService}>
                <Outlet />
            </CategoryTeaserServiceProvider>
            </MetadataEditServiceProvider>
            </CommentServiceProvider>
            </RatingServiceProvider>
            </ExifServiceProvider>
            </VisualEffectsProvider>
            </SlideshowProvider>
            </ActiveMediaItem>
            </MediaLoader>
            </MediaListProvider>
        </AuthGuard>
    );
}

export default MediaCategory;
