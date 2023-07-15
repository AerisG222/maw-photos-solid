import { Resource, createResource } from 'solid-js';

import { VideoCategory } from '../../models/Category';
import { ICategoryService } from './ICategoryService';
import { isLoggedIn } from '../../auth/auth';
import { getVideoCategories, getVideos, setTeaser } from '../../api/VideoCategories';
import { Video } from '../../models/Media';

class VideoCategoryService
    implements ICategoryService
{
    private getCategories = (isLoggedIn: boolean) => isLoggedIn ? getVideoCategories() : null;

    load(): Resource<VideoCategory[]> {
        const [resource] = createResource(isLoggedIn, this.getCategories);

        return resource;
    }

    loadMedia(categoryId: number): Resource<Video[]> {
        const [resource] = createResource(() => getVideos(categoryId));

        return resource;
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const videoCategoryService = new VideoCategoryService();
