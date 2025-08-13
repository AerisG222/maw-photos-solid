import { VideoCategory } from "../../_models/Category";
import { ICategoryService } from "./ICategoryService";
import { getVideoCategories, getVideoCategory, getVideos, setTeaser } from "../../_api/VideoCategories";
import { Video } from "../../_models/Media";

class VideoCategoryService
    implements ICategoryService
{
    load(): Promise<VideoCategory[]> {
        // TODO: add this check back?
        // return isLoggedIn() ? getVideoCategories() : null;
        return getVideoCategories();
    }

    loadSingle(categoryId: number): Promise<VideoCategory> {
        return getVideoCategory(categoryId);
    }

    loadMedia(categoryId: number): Promise<Video[]> {
        return getVideos(categoryId);
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const videoCategoryService = new VideoCategoryService();
