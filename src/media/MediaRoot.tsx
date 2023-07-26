import { Outlet, useParams } from '@solidjs/router';
import { Component } from 'solid-js';

import { MediaListProvider } from './contexts/MediaListContext';
import { useCategoryContext } from '../contexts/CategoryContext';
import { CategoryType } from '../_models/CategoryType';
import { SlideshowProvider } from './contexts/SlideshowContext';
import { VisualEffectsProvider } from './contexts/VisualEffectsContext';
import { CategoryTeaserServiceProvider } from './contexts/CategoryTeaserServiceContext';
import { CommentServiceProvider } from './contexts/CommentServiceContext';
import { ExifServiceProvider } from './contexts/ExifServiceContext';
import { MetadataEditServiceProvider } from './contexts/MetadataEditServiceContext';
import { RatingServiceProvider } from './contexts/RatingServiceContext';

import AuthGuard from '../components/auth/AuthGuard';
import MediaLoader from './MediaLoader';
import ActiveMediaItem from './ActiveMediaItem';
import ActiveCategoryMonitor from './ActiveCategoryMonitor';

const MediaRoot: Component = () => {
    const params = useParams();
    const [, {setActiveCategoryById}] = useCategoryContext();

    if(params.categoryType && params.categoryId) {
        // dont monitor this in a reactive context, it will reload with each navigation to new category
        setActiveCategoryById(params.categoryType as CategoryType, parseInt(params.categoryId, 10));
    }

    return (
        <AuthGuard>
            <MediaListProvider>
            <ExifServiceProvider>
            <RatingServiceProvider>
            <CommentServiceProvider>
            <MetadataEditServiceProvider>
            <CategoryTeaserServiceProvider>
            <MediaLoader>
            <ActiveCategoryMonitor>
            <ActiveMediaItem>
            <SlideshowProvider>
            <VisualEffectsProvider>
                <Outlet />
            </VisualEffectsProvider>
            </SlideshowProvider>
            </ActiveMediaItem>
            </ActiveCategoryMonitor>
            </MediaLoader>
            </CategoryTeaserServiceProvider>
            </MetadataEditServiceProvider>
            </CommentServiceProvider>
            </RatingServiceProvider>
            </ExifServiceProvider>
            </MediaListProvider>
        </AuthGuard>
    );
}

export default MediaRoot;
