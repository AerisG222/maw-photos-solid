import { ICategoryService } from '../_services/categories/ICategoryService';
import { CategoryType } from './CategoryType';
import { photoCategoryService } from '../_services/categories/PhotoCategoryService';
import { videoCategoryService } from '../_services/categories/VideoCategoryService';

type CategoryTypeInfo = {
    nameSingular: string;
    namePlural: string;
    routePart: string;  // todo: improve naming
    icon: string;
    svc: ICategoryService;
};

export const categoryTypes: Record<CategoryType, CategoryTypeInfo> = {
    photo: {
        nameSingular: "Photo",
        namePlural: "Photos",
        routePart: "photos",
        icon: "i-ic-round-camera-alt",
        svc: photoCategoryService
    },
    video: {
        nameSingular: "Video",
        namePlural: "Videos",
        routePart: "videos",
        icon: "i-ic-round-videocam",
        svc: videoCategoryService
    }
};
