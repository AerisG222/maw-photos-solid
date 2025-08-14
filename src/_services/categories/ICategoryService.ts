import { Category } from '../../_models/Category';
import { Media } from "../../_models/Media";

export interface ICategoryService {
    load: () => Promise<Category[]>;
    loadSingle: (categoryId: Uuid) => Promise<Category | undefined>;
    loadMedia: (categoryId: Uuid) => Promise<Media[]>;
    setTeaser: (categoryId: Uuid, id: Uuid) => Promise<Response | undefined>;
}
