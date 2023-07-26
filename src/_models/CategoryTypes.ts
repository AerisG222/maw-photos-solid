import { CategoryType } from './CategoryType';
import { KeyValuePair } from './KeyValuePair';
import { MediaView, MediaViewAll } from '../media/_routes';

export type CategoryTypeInfo = {
    nameSingular: string;
    namePlural: string;
    routePart: string;  // todo: improve naming
    icon: string;
    views: MediaView[];
    slideshowAvailable: boolean;
};

// if you add categoryTypes, please be sure to safelist the icon in unocss.config.ts
export const categoryTypes: Record<CategoryType, CategoryTypeInfo> = {
    photos: {
        nameSingular: "Photo",
        namePlural: "Photos",
        routePart: "photos",
        icon: "i-ic-round-camera-alt",
        views: MediaViewAll,
        slideshowAvailable: true
    },
    videos: {
        nameSingular: "Video",
        namePlural: "Videos",
        routePart: "videos",
        icon: "i-ic-round-videocam",
        views: MediaViewAll,
        slideshowAvailable: false
    }
};

export const categoryTypesOptions: KeyValuePair<string>[] = [
    {id: 'all', name: 'All'},
    ...Object.entries(categoryTypes).map(([key, value]) => ({id: key, name: value.namePlural}))
];

export const categoryTypeIcons = Object.entries(categoryTypes).map(([key, value]) => value.icon);
