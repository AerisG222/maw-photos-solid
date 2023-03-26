import { ValueDescriptor } from './value-descriptor';

export enum CategoryViewMode {
    grid = 'grid',
    list = 'list',
}

export const allCategoryViewModes: ValueDescriptor<CategoryViewMode>[] = [
    { value: CategoryViewMode.grid, name: 'Grid' },
    { value: CategoryViewMode.list, name: 'List' },
];

export const toCategoryViewMode = (
    val?: string | null
): CategoryViewMode | undefined => {
    if (!val) {
        return undefined;
    }

    return CategoryViewMode[val as keyof typeof CategoryViewMode];
};
