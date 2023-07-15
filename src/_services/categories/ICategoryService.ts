import { Resource } from 'solid-js';

import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';

export interface ICategoryService {
    load: () => Resource<Category[]>;
    loadMedia: (categoryId: number) => Resource<Media[]>;
    setTeaser: (categoryId: number, id: number) => Promise<Response>;
}
