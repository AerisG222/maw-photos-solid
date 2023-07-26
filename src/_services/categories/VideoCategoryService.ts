import { VideoCategory } from '../../_models/Category';
import { ICategoryService } from './ICategoryService';
import { isLoggedIn } from '../../auth/auth';
import { getVideoCategories, getVideos, setTeaser } from '../../_api/VideoCategories';
import { Video } from '../../_models/Media';

class VideoCategoryService
    implements ICategoryService
{
    load(): Promise<VideoCategory[]> {
        return isLoggedIn() ? getVideoCategories() : null;
    }

    loadMedia(categoryId: number): Promise<Video[]> {
        return getVideos(categoryId);
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const videoCategoryService = new VideoCategoryService();
