import { Resource, createResource } from 'solid-js';

import { getPhotoCategories, getPhotos, setTeaser } from '../../_api/PhotoCategories';
import { PhotoCategory } from '../../_models/Category';
import { ICategoryService } from './ICategoryService';
import { isLoggedIn } from '../../auth/auth';
import { Photo } from '../../_models/Media';

export class PhotoCategoryService
    implements ICategoryService
{
    private getCategories = (isLoggedIn: boolean) =>
        isLoggedIn ? getPhotoCategories() : undefined;

    load(): Resource<PhotoCategory[]> {
        const [resource] = createResource(isLoggedIn, this.getCategories);

        return resource;
    }

    loadMedia(categoryId: number): Resource<Photo[]> {
        const [resource] = createResource(() => getPhotos(categoryId));

        return resource;
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const photoCategoryService = new PhotoCategoryService();
