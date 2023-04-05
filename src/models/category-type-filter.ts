import { KeyValuePair } from './key-value-pair';

export type CategoryTypeFilterIdType = string;
export type CategoryTypeFilter = KeyValuePair<CategoryTypeFilterIdType>;

export const allCategoryTypeFilters: CategoryTypeFilter[] = [
    { id: 'all',    name: 'Photos and Videos' },
    { id: 'photos', name: 'Photos' },
    { id: 'videos', name: 'Videos' },
];

export const defaultCategoryTypeFilter: CategoryTypeFilterIdType = 'all';
