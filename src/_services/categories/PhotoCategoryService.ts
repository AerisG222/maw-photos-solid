import { Resource, createResource } from 'solid-js';

import { getPhotoCategories, setTeaser } from '../../api/PhotoCategories';
import { PhotoCategory } from '../../models/Category';
import { ICategoryService } from './ICategoryService';
import { isLoggedIn } from '../../auth/auth';

class PhotoCategoryService
    implements ICategoryService
{
    private getPhotoCats = (isLoggedIn: boolean) => isLoggedIn ? getPhotoCategories() : null;

    load(): Resource<PhotoCategory[]> {
        const [resource] = createResource(isLoggedIn, this.getPhotoCats);

        return resource;
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const photoCategoryService = new PhotoCategoryService();
