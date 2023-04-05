import { CategoryViewModeIdType, defaultCategoryViewMode } from '../CategoryViewMode';

export type SearchPageSettingsState = {
    readonly viewMode: CategoryViewModeIdType;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewMode: defaultCategoryViewMode,
};
