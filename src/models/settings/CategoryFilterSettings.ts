import { CategoryTypeFilter } from '../category-type-filter';
import { KEY_SETTINGS_CATEGORY_FILTER, loadJson } from './storage';

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

export function loadCategoryFilterSettings() {
    return loadJson(KEY_SETTINGS_CATEGORY_FILTER, defaultCategoryFilterSettings);
}
