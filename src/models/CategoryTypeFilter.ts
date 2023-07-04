import { Category } from './Category';
import { KeyValuePair } from './KeyValuePair';
import { MediaTypePhoto, MediaTypeVideo } from './Media';
import { equalsIgnoreCase } from './utils/StringUtils';

export type CategoryTypeFilterIdType = string;
export type CategoryTypeFilter = KeyValuePair<CategoryTypeFilterIdType> & { filter: (c: Category) => boolean };

export const allCategoryTypeFilters: CategoryTypeFilter[] = [
    { id: 'all',          name: 'Photos and Videos', filter: (c: Category) => true },
    { id: MediaTypePhoto, name: 'Photos',            filter: (c: Category) => MediaTypePhoto === c.type },
    { id: MediaTypeVideo, name: 'Videos',            filter: (c: Category) => MediaTypeVideo === c.type },
];

export const defaultCategoryTypeFilter: CategoryTypeFilterIdType = 'all';

export const getCategoryTypeFilter = (id: CategoryTypeFilterIdType) =>
    allCategoryTypeFilters.find(c => c.id === id) ?? allCategoryTypeFilters[0];

export const iconPhoto = 'i-ic-round-camera-alt';
export const iconVideo = 'i-ic-round-videocam';
export const allCategoryTypeIcons = [iconPhoto, iconVideo];

export const getCategoryTypeIcon = (categoryType: string) => {
    if(equalsIgnoreCase(categoryType, 'video')) {
        return { [iconVideo]: true };
    }

    return { [iconPhoto]: true };
};
