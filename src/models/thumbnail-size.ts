import { ValueDescriptor } from './value-descriptor';

export enum ThumbnailSize {
    default = 'default',
    small = 'small',
    verySmall = 'verySmall',
    tiny = 'tiny',
}

export const allThumbnailSizes: ValueDescriptor<ThumbnailSize>[] = [
    { value: ThumbnailSize.default, name: 'Default' },
    { value: ThumbnailSize.small, name: 'Small' },
    { value: ThumbnailSize.verySmall, name: 'Very Small' },
    { value: ThumbnailSize.tiny, name: 'Tiny' },
];

export const toThumbnailSize = (
    val?: string | null
): ThumbnailSize | undefined => {
    if (!val) {
        return undefined;
    }

    return ThumbnailSize[val as keyof typeof ThumbnailSize];
};

export const toThumbnailSizeDefaulted = (
    val?: string | null
): ThumbnailSize => {
    const size = toThumbnailSize(val);

    return size ? size : ThumbnailSize.default;
};

export const nextThumbnailSize = (size: ThumbnailSize): ThumbnailSize => {
    switch (size) {
        case ThumbnailSize.default:
            return ThumbnailSize.small;
        case ThumbnailSize.small:
            return ThumbnailSize.verySmall;
        case ThumbnailSize.verySmall:
            return ThumbnailSize.tiny;
        case ThumbnailSize.tiny:
        default:
            return ThumbnailSize.default;
    }
};
