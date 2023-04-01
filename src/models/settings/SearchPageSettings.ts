import { CategoryViewModeIdType, defaultCategoryViewModeId } from '../category-view-mode';

export type SearchPageSettingsState = {
    readonly viewModeId: CategoryViewModeIdType;
};

export const defaultSearchPageSettings: SearchPageSettingsState = {
    viewModeId: defaultCategoryViewModeId,
};
