import { CategoryViewModeIdType, defaultCategoryViewMode } from '../category-view-mode';

export type SearchPageSettingsState = {
    readonly viewMode: CategoryViewModeIdType;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewMode: defaultCategoryViewMode,
};
