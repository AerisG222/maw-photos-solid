import { ICategory } from './Category';
import { KeyValuePair } from './KeyValuePair';
import { equalsIgnoreCase } from './Utils';

export type CategoryTypeFilterIdType = string;
export type CategoryTypeFilter = KeyValuePair<CategoryTypeFilterIdType> & { filter: (c: ICategory) => boolean };

export const allCategoryTypeFilters: CategoryTypeFilter[] = [
    { id: 'all',   name: 'Photos and Videos', filter: (c: ICategory) => true },
    { id: 'photo', name: 'Photos',            filter: (c: ICategory) => equalsIgnoreCase('photo', c.type) },
    { id: 'video', name: 'Videos',            filter: (c: ICategory) => equalsIgnoreCase('video', c.type) },
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
}
