import { Resource, createResource } from 'solid-js';

import { VideoCategory } from '../../models/Category';
import { ICategoryService } from './ICategoryService';
import { isLoggedIn } from '../../auth/auth';
import { getVideoCategories, setTeaser } from '../../api/VideoCategories';

class VideoCategoryService
    implements ICategoryService
{
    private getCategories = (isLoggedIn: boolean) => isLoggedIn ? getVideoCategories() : null;

    load(): Resource<VideoCategory[]> {
        const [resource] = createResource(isLoggedIn, this.getCategories);

        return resource;
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const videoCategoryService = new VideoCategoryService();
