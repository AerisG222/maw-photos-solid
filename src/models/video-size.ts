import { KeyValuePair } from './key-value-pair';

export type VideoSizeIdType = string;
export type VideoSize = KeyValuePair<VideoSizeIdType>;

export const allVideoSizes: VideoSize[] = [
    { id: 'small', name: 'Small' },
    { id: 'large', name: 'Large' },
];

export const defaultVideoSizeId: VideoSizeIdType = 'large';
