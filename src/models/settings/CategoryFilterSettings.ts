import { CategoryTypeFilterIdType, defaultCategoryTypeFilter } from '../category-type-filter';

export type CategoryFilterSettingsState = {
    readonly typeFilter: CategoryTypeFilterIdType;
    readonly yearFilter: string | number;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilter: defaultCategoryTypeFilter,
    yearFilter: 'all',
    missingGpsFilter: false,
};
