import { CategoryViewModeIdType, defaultCategoryViewModeId } from '../category-view-mode';

export type CategoryPageSettingsState = {
    readonly viewModeId: CategoryViewModeIdType;
};

export const defaultCategoryPageSettings: CategoryPageSettingsState = {
    viewModeId: defaultCategoryViewModeId
};

