import { CategoryType } from '../CategoryType';

export type CategoryFilterSettingsState = {
    readonly typeFilter?: CategoryType;
    readonly yearFilter?: number;
    readonly missingGpsFilter: boolean;
};

export const defaultCategoryFilterSettings: CategoryFilterSettingsState = {
    typeFilter: undefined,
    yearFilter: undefined,
    missingGpsFilter: false,
};
