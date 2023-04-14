import { Category } from './Category';
import { KeyValuePair } from './KeyValuePair';
import { equalsIgnoreCase } from './Utils';

export type CategoryTypeFilterIdType = string;
export type CategoryTypeFilter = KeyValuePair<CategoryTypeFilterIdType> & { filter: (c: Category) => boolean };

export const allCategoryTypeFilters: CategoryTypeFilter[] = [
    { id: 'all',    name: 'Photos and Videos', filter: (c: Category) => true },
    { id: 'photos', name: 'Photos',            filter: (c: Category) => equalsIgnoreCase('photo', c.type) },
    { id: 'videos', name: 'Videos',            filter: (c: Category) => equalsIgnoreCase('video', c.type) },
];

export const defaultCategoryTypeFilter: CategoryTypeFilterIdType = 'all';

export const getCategoryTypeFilter = (id: CategoryTypeFilterIdType) =>
    allCategoryTypeFilters.find(c => c.id === id) ?? allCategoryTypeFilters[0];

// todo: does not belong here
export const yearFilterPredicate = (c: Category, year: number) =>
    !!year && year > 0 ? year === c.year : true;
