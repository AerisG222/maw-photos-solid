import { Component } from "solid-js";
import { Outlet, useParams } from '@solidjs/router';

import { MediaListProvider } from '../contexts/MediaListContext';

import AuthGuard from '../components/auth/AuthGuard';
import VideoLoader from './VideoLoader';

const VideoCategories: Component = () => {
    const params = useParams();

    return (
        <AuthGuard>
            <MediaListProvider>
            <VideoLoader
                categoryId={parseInt(params.categoryId, 10)}
                videoId={params.videoId ? parseInt(params.videoId, 10) : undefined}>
                <Outlet />
            </VideoLoader>
            </MediaListProvider>
        </AuthGuard>
    );
};

export default VideoCategories;
