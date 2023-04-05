import { CategoryViewModeIdType, defaultCategoryViewMode } from '../category-view-mode';

export type CategoryPageSettingsState = {
    readonly viewMode: CategoryViewModeIdType;
};

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewMode: defaultCategoryViewMode
};

