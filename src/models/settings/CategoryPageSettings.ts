import { CategoryViewMode } from '../category-view-mode';

export type CategoryPageSettingsState = {
    readonly viewMode: CategoryViewMode;
};

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewMode: CategoryViewMode.grid
};

