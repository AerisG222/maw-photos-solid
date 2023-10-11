import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";

export interface ICategoryService {
    load: () => Promise<Category[]>;
    loadSingle: (categoryId: number) => Promise<Category>;
    loadMedia: (categoryId: number) => Promise<Media[]>;
    setTeaser: (categoryId: number, id: number) => Promise<Response>;
}
