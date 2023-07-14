import { ICategoryService } from '../_services/categories/ICategoryService';
import { CategoryType } from './CategoryType';
import { photoCategoryService } from '../_services/categories/PhotoCategoryService';
import { videoCategoryService } from '../_services/categories/VideoCategoryService';
import { KeyValuePair } from './KeyValuePair';
import { MediaView, MediaViewAll } from '../media/_routes';

type CategoryTypeInfo = {
    nameSingular: string;
    namePlural: string;
    routePart: string;  // todo: improve naming
    icon: string;
    svc: ICategoryService;
    views: MediaView[];
};

// if you add categoryTypes, please be sure to safelist the icon in unocss.config.ts
export const categoryTypes: Record<CategoryType, CategoryTypeInfo> = {
    photo: {
        nameSingular: "Photo",
        namePlural: "Photos",
        routePart: "photos",
        icon: "i-ic-round-camera-alt",
        svc: photoCategoryService,
        views: MediaViewAll
    },
    video: {
        nameSingular: "Video",
        namePlural: "Videos",
        routePart: "videos",
        icon: "i-ic-round-videocam",
        svc: videoCategoryService,
        views: MediaViewAll
    }
};

export const categoryTypesOptions: KeyValuePair<string>[] = [
    {id: 'all', name: 'All'},
    ...Object.keys(categoryTypes).map(key => ({id: key, name: categoryTypes[key].namePlural}))
];
