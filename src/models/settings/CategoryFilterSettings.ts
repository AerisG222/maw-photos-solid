import { CategoryTypeFilterIdType, defaultCategoryTypeFilter } from '../CategoryTypeFilter';
import { YearFilterIdType } from '../YearFilter';

export type CategoryFilterSettingsState = {
    readonly typeFilter: CategoryTypeFilterIdType;
    readonly yearFilter: YearFilterIdType;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilter: defaultCategoryTypeFilter,
    yearFilter: 'all',
    missingGpsFilter: false,
};
