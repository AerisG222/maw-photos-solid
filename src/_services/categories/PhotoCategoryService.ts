import { getPhotoCategories, getPhotoCategory, getPhotos, setTeaser } from "../../_api/PhotoCategories";
import { PhotoCategory } from "../../_models/Category";
import { ICategoryService } from "./ICategoryService";
import { isLoggedIn } from "../../auth/auth";
import { Photo } from "../../_models/Media";

export class PhotoCategoryService
    implements ICategoryService
{
    load(): Promise<PhotoCategory[]> {
        return isLoggedIn() ? getPhotoCategories() : undefined;
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
