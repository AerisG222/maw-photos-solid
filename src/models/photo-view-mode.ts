import { ValueDescriptor } from './value-descriptor';

export enum PhotoViewMode {
    bulkEdit = 'bulk-edit',
    detail = 'detail',
    fullscreen = 'fullscreen',
    grid = 'grid',
    map = 'map',
}

export const allPhotoViewModes: ValueDescriptor<PhotoViewMode>[] = [
    { value: PhotoViewMode.bulkEdit, name: 'Bulk Edit' },
    { value: PhotoViewMode.detail, name: 'Detail' },
    { value: PhotoViewMode.fullscreen, name: 'Fullscreen' },
    { value: PhotoViewMode.grid, name: 'Grid' },
    { value: PhotoViewMode.map, name: 'Map' },
];

export const allRandomViewModes: ValueDescriptor<PhotoViewMode>[] = [
    { value: PhotoViewMode.detail, name: 'Detail' },
    { value: PhotoViewMode.fullscreen, name: 'Fullscreen' },
    { value: PhotoViewMode.grid, name: 'Grid' },
];

export const isValidPhotoViewMode = (val?: string | null): boolean => {
    return !!toPhotoViewMode(val);
};

export const toPhotoViewMode = (
    val?: string | null
): PhotoViewMode | undefined => {
    if (!val) {
        return undefined;
    }

    return PhotoViewMode[val as keyof typeof PhotoViewMode];
};
