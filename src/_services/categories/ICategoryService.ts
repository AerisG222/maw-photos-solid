import { Resource } from 'solid-js';

import { Category } from '../../models/Category';

export interface ICategoryService {
    load: () => Resource<Category[]>;
    setTeaser: (categoryId: number, id: number) => Promise<Response>;
}
