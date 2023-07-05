import { Component } from "solid-js";
import { Outlet, useParams } from '@solidjs/router';

import { MediaListProvider } from '../contexts/MediaListContext';

import AuthGuard from '../components/auth/AuthGuard';
import VideoLoader from './VideoLoader';
import { VideoMediaService } from '../api/VideoMediaService';
import { RatingServiceProvider } from '../contexts/RatingServiceContext';
import { CommentServiceProvider } from '../contexts/CommentServiceContext';
import { MetadataEditServiceProvider } from '../contexts/MetadataEditServiceContext';
import { CategoryTeaserServiceProvider } from '../contexts/CategoryTeaserServiceContext';

const VideoCategories: Component = () => {
    const params = useParams();
    const mediaService = new VideoMediaService();

    return (
        <AuthGuard>
            <MediaListProvider>
            <VideoLoader
                categoryId={parseInt(params.categoryId, 10)}
                id={params.id ? parseInt(params.id, 10) : undefined}>
            <RatingServiceProvider svc={mediaService}>
            <CommentServiceProvider svc={mediaService}>
            <MetadataEditServiceProvider svc={mediaService}>
            <CategoryTeaserServiceProvider svc={mediaService}>
                <Outlet />
            </CategoryTeaserServiceProvider>
            </MetadataEditServiceProvider>
            </CommentServiceProvider>
            </RatingServiceProvider>
            </VideoLoader>
            </MediaListProvider>
        </AuthGuard>
    );
};

export default VideoCategories;
