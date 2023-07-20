import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { VideoCategory as ApiVideoCategory } from './models/VideoCategory';
import { Video as ApiVideo } from './models/Video';
import { VideoCategory } from '../_models/Category';
import { MediaTypeVideo, Video } from '../_models/Media';
import { CategoryTypeVideos } from '../_models/CategoryType';
import { getCategoryPath } from '../categories/_routes';

export const getVideoCategories = async (): Promise<VideoCategory[]> => {
    const videoCategories = await internalGetVideoCategories();

    return videoCategories.items.map(x => ({
        id: x.id,
        type: CategoryTypeVideos,
        name: x.name,
        year: x.year,
        createDate: x.createDate,
        teaserImageUrl: x.teaserImageSq.url,
        latitude: x.latitude,
        longitude: x.longitude,
        count: x.videoCount,
        totalSize: x.totalSize,
        isMissingGpsData: x.isMissingGpsData,
        route: getCategoryPath(CategoryTypeVideos, x.id),
        totalDuration: x.totalDuration
    }));
};

export const getVideos = async (categoryId: number): Promise<Video[]> => {
    const videos = await internalGetVideos(categoryId);

    return videos.items.map(x => ({
        kind: MediaTypeVideo,
        id: x.id,
        categoryId: x.categoryId,
        createDate: x.createDate,
        latitude: x.latitude,
        longitude: x.longitude,
        thumbnailSqUrl: x.thumbnailSq.url,
        videoScaledUrl: x.videoScaled.url,
        videoScaledHeight: x.videoScaled.height,
        videoScaledWidth: x.videoScaled.width,
        videoFullUrl: x.videoFull.url,
        videoFullHeight: x.videoFull.height,
        videoFullWidth: x.videoFull.width
    }));
};

const internalGetVideoCategories = () =>
    queryMawApi<ApiCollection<ApiVideoCategory>>('video-categories');

const internalGetVideos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiVideo>>(`video-categories/${categoryId}/videos`);

export const setTeaser = (categoryId: number, videoId: number) =>
    patchMawApi(`video-categories/${categoryId}/teaser`, { videoId });