import { patchMawApi, queryMawApi } from "./Shared";
import { ApiCollection } from "./models/ApiCollection";
import { VideoCategory as ApiVideoCategory } from "./models/VideoCategory";
import { Video as ApiVideo } from "./models/Video";
import { VideoCategory } from "../_models/Category";
import { MediaTypeVideo, Video } from "../_models/Media";
import { CategoryTypeVideos } from "../_models/CategoryType";
import { getCategoryPath } from "../categories/_routes";

const mapApiVideoCategory = (cat: ApiVideoCategory): VideoCategory => ({
    id: cat.id,
    type: CategoryTypeVideos,
    name: cat.name,
    year: cat.year,
    createDate: cat.createDate,
    teaserImageUrl: cat.teaserImageSq.url,
    latitude: cat.latitude,
    longitude: cat.longitude,
    count: cat.videoCount,
    totalSize: cat.totalSize,
    isMissingGpsData: cat.isMissingGpsData,
    route: getCategoryPath(CategoryTypeVideos, cat.id),
    totalDuration: cat.totalDuration
});

export const getVideoCategories = async (): Promise<VideoCategory[]> => {
    const videoCategories = await internalGetVideoCategories();

    return videoCategories.items.map(mapApiVideoCategory);
};

export const getVideoCategory = async (categoryId: number): Promise<VideoCategory> => {
    const category = await internalGetVideoCategory(categoryId);

    return mapApiVideoCategory(category);
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
    queryMawApi<ApiCollection<ApiVideoCategory>>("video-categories");

const internalGetVideoCategory = (categoryId: number) =>
    queryMawApi<ApiVideoCategory>(`video-categories/${categoryId}`);

const internalGetVideos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiVideo>>(`video-categories/${categoryId}/videos`);

export const setTeaser = (categoryId: number, videoId: number) =>
    patchMawApi(`video-categories/${categoryId}/teaser`, { videoId });
