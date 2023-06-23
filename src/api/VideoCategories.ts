import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { VideoCategory } from './models/VideoCategory';
import { Video } from './models/Video';

export const getVideoCategories = () =>
    queryMawApi<ApiCollection<VideoCategory>>('video-categories');

export const getVideos = (categoryId: number) =>
    queryMawApi<ApiCollection<Video>>(`video-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, videoId: number) =>
    patchMawApi(`video-categories/${categoryId}/teaser`, { videoId });
