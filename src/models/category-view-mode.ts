import { KeyValuePair } from './key-value-pair';

export type CategoryViewModeIdType = string;
export type CategoryViewMode = KeyValuePair<CategoryViewModeIdType>;

export const allCategoryViewModes: CategoryViewMode[] = [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' },
];

export const defaultCategoryViewMode: CategoryViewModeIdType = 'grid';
