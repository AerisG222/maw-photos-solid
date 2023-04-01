import { CategoryTypeFilterIdType, defaultCategoryTypeFilterId } from '../category-type-filter';

export type CategoryFilterSettingsState = {
    readonly typeFilterId: CategoryTypeFilterIdType;
    readonly yearFilter: string | number;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilterId: defaultCategoryTypeFilterId,
    yearFilter: 'all',
    missingGpsFilter: false,
};
