import { CategoryViewMode } from '../category-view-mode';

export type SearchPageSettingsState = {
    readonly viewMode: CategoryViewMode;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewMode: CategoryViewMode.grid,
};
