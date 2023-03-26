import { CategoryViewMode } from '../category-view-mode';
import { KEY_SETTINGS_CATEGORY_PAGE, loadJson } from './storage';

export type CategoryPageSettingsState = {
    readonly viewMode: CategoryViewMode;
};

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewMode: CategoryViewMode.grid
};

export function loadCategoryPageSettings() {
    return loadJson(KEY_SETTINGS_CATEGORY_PAGE, defaultCategoryPageSettings);
}
