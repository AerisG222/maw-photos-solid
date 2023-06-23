import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { VideoCategory as ApiVideoCategory } from './models/VideoCategory';
import { Video as ApiVideo } from './models/Video';
import { VideoCategory } from '../models/Category';

export const getVideoCategories = async (): Promise<VideoCategory[]> => {
    const videoCategories = await internalGetVideoCategories();

    return videoCategories.items.map(x => ({
        id: x.id,
        type: 'photo',
        name: x.name,
        year: x.year,
        createDate: x.createDate,
        teaserImageUrl: x.teaserImageSq.url,
        latitude: x.latitude,
        longitude: x.longitude,
        count: x.videoCount,
        totalSize: x.totalSize,
        isMissingGpsData: x.isMissingGpsData,
        route: `categories/videos/${x.id}`,
        totalDuration: x.totalDuration
    }));
}

const internalGetVideoCategories = () =>
    queryMawApi<ApiCollection<ApiVideoCategory>>('video-categories');

export const getVideos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiVideo>>(`video-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, videoId: number) =>
    patchMawApi(`video-categories/${categoryId}/teaser`, { videoId });
