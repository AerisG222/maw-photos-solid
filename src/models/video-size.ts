import { ValueDescriptor } from './value-descriptor';

export enum VideoSize {
    small = 'small',
    large = 'large',
}

export const allVideoSizes: ValueDescriptor<VideoSize>[] = [
    { value: VideoSize.small, name: 'Small' },
    { value: VideoSize.large, name: 'Large' },
];

export const toVideoSize = (val: string | null): VideoSize | undefined => {
    if (!val) {
        return undefined;
    }

    return VideoSize[val as keyof typeof VideoSize];
};

export const toVideoSizeDefaulted = (val: string | null): VideoSize | null => {
    const size = toVideoSize(val);

    return size ? size : VideoSize.small;
};

export const nextVideoSize = (size: VideoSize): VideoSize => {
    switch (size) {
        case VideoSize.small:
            return VideoSize.large;
        case VideoSize.large:
            return VideoSize.small;
        default:
            console.error('invalid video size requested');
    }

    return VideoSize.small;
};
