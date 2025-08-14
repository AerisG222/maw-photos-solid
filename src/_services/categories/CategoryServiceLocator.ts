import { CategoryType, CategoryTypePhotos, CategoryTypeVideos } from "../../_models/CategoryType";
import { ICategoryService } from "./ICategoryService";
import { photoCategoryService } from "./PhotoCategoryService";
import { videoCategoryService } from "./VideoCategoryService";

export const getCategoryService = (type: CategoryType): ICategoryService => {
    switch (type) {
        case CategoryTypePhotos:
            return photoCategoryService;
        case CategoryTypeVideos:
            return videoCategoryService;
        default:
            throw `unknown CategoryType: ${type}`;
    }
};
