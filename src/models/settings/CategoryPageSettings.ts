import { CategoryViewModeIdType, defaultCategoryViewMode } from '../CategoryViewMode';

export type CategoryPageSettingsState = {
    readonly viewMode: CategoryViewModeIdType;
};

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewMode: defaultCategoryViewMode
};

