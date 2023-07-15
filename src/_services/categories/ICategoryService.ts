import { Resource } from 'solid-js';

import { Category } from '../../models/Category';
import { Media } from '../../models/Media';

export interface ICategoryService {
    load: () => Resource<Category[]>;
    loadMedia: (categoryId: number) => Resource<Media[]>;
    setTeaser: (categoryId: number, id: number) => Promise<Response>;
}
