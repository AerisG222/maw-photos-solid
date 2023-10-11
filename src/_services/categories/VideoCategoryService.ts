import { VideoCategory } from "../../_models/Category";
import { ICategoryService } from "./ICategoryService";
import { isLoggedIn } from "../../auth/auth";
import { getVideoCategories, getVideoCategory, getVideos, setTeaser } from "../../_api/VideoCategories";
import { Video } from "../../_models/Media";

class VideoCategoryService
    implements ICategoryService
{
    load(): Promise<VideoCategory[]> {
        return isLoggedIn() ? getVideoCategories() : null;
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
