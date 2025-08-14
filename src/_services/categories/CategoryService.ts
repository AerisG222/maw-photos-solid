import { getCategories, getCategory, getMedia, setTeaser } from "../../_api/Categories";
import { ICategoryService } from "./ICategoryService";
import { Media } from "../../_models/Media";
import { Category } from "../../_models/Category";

export class CategoryService implements ICategoryService {
    async load(): Promise<Category[]> {
        // TODO: add this check back?
        // return await isLoggedIn() ? getPhotoCategories() : undefined;
        return await getCategories();
    }

    loadSingle(categoryId: Uuid): Promise<Category | undefined> {
        return getCategory(categoryId);
    }

    loadMedia(categoryId: Uuid): Promise<Media[]> {
        return getMedia(categoryId);
    }

    setTeaser(categoryId: Uuid, id: Uuid): Promise<Response | undefined> {
        return setTeaser(categoryId, id);
    }
}

// TODO: consider adding these services to a context
export const categoryService = new CategoryService();
