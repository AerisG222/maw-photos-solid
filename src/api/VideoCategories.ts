import { queryMawApi } from './Shared';
import { ApiCollection } from '../models/api/ApiCollection';
import { VideoCategory } from '../models/api/VideoCategory';
import { Video } from '../models/api/Video';

export const getVideoCategories = () =>
    queryMawApi<ApiCollection<VideoCategory>>('video-categories');

export const getVideos = (categoryId: number) =>
    queryMawApi<ApiCollection<Video>>(`video-categories/${categoryId}/photos`);
