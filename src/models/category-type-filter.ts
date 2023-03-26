import { ValueDescriptor } from './value-descriptor';

export enum CategoryTypeFilter {
    all = 'all',
    photos = 'photos',
    videos = 'videos',
}

export const allCategoryTypeFilters: ValueDescriptor<CategoryTypeFilter>[] = [
    { value: CategoryTypeFilter.all, name: 'Photos and Videos' },
    { value: CategoryTypeFilter.photos, name: 'Photos' },
    { value: CategoryTypeFilter.videos, name: 'Videos' },
];

export const toCategoryTypeFilter = (
    val?: string | null
): CategoryTypeFilter | undefined => {
    if (!val) {
        return undefined;
    }

    return CategoryTypeFilter[val as keyof typeof CategoryTypeFilter];
};
