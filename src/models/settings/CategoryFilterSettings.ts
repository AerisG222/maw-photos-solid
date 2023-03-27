import { CategoryTypeFilter } from '../category-type-filter';

export type CategoryFilterSettingsState = {
    readonly typeFilter: CategoryTypeFilter;
    readonly yearFilter: string | number;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilter: CategoryTypeFilter.all,
    yearFilter: 'all',
    missingGpsFilter: false,
};
