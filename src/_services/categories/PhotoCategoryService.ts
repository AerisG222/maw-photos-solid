import { getPhotoCategories, getPhotoCategory, getPhotos, setTeaser } from "../../_api/PhotoCategories";
import { PhotoCategory } from "../../_models/Category";
import { ICategoryService } from "./ICategoryService";
import { Photo } from "../../_models/Media";

export class PhotoCategoryService
    implements ICategoryService
{
    async load(): Promise<PhotoCategory[]> {
        // TODO: add this check back?
        // return await isLoggedIn() ? getPhotoCategories() : undefined;
        return await getPhotoCategories();
    }

    loadSingle(categoryId: number): Promise<PhotoCategory> {
        return getPhotoCategory(categoryId);
    }

    loadMedia(categoryId: number): Promise<Photo[]> {
        return getPhotos(categoryId);
    }

    setTeaser(categoryId: number, id: number): Promise<Response> {
        return setTeaser(categoryId, id);
    }
}

export const photoCategoryService = new PhotoCategoryService();
