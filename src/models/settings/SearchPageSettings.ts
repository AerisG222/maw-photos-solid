import { CategoryViewMode } from '../category-view-mode';
import { KEY_SETTINGS_SEARCH_PAGE, loadJson } from './storage';

export type SearchPageSettingsState = {
    readonly viewMode: CategoryViewMode;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewMode: CategoryViewMode.grid,
};

export function loadSearchPageSettings() {
    return loadJson(KEY_SETTINGS_SEARCH_PAGE, defaultSearchPageSettings);
}
