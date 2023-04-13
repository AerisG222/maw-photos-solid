import { PhotoCategory } from './api/PhotoCategory';
import { VideoCategory } from './api/VideoCategory';
import { CategoryTeaser } from './CategoryTeaser';

export type Category =
    CategoryTeaser & {
        createDate: Date;
        actual: PhotoCategory | VideoCategory;
    }

export const adaptPhotoCategories = (categories: PhotoCategory[]): Category[] =>
    categories.map((c) => adaptPhotoCategory(c));

function adaptPhotoCategory(category: PhotoCategory): Category {
    return {
        type: 'photo',
        route: 'asdf', //RouteHelper.photoCategoriesAbs(undefined, category.id),
        id: category.id,
        name: category.name,
        year: category.year,
        createDate: category.createDate,
        teaserImage: category.teaserImage,
        teaserImageSq: category.teaserImageSq,
        actual: category,
    };
}

export const adaptVideoCategories = (categories: VideoCategory[]): Category[] =>
    categories.map((c) => adaptVideoCategory(c));

function adaptVideoCategory(category: VideoCategory): Category {
    return {
        type: 'video',
        route: 'asdf2', //RouteHelper.videoCategoriesAbs(category.id),
        id: category.id,
        name: category.name,
        year: category.year,
        createDate: category.createDate,
        teaserImage: category.teaserImage,
        teaserImageSq: category.teaserImageSq,
        actual: category,
    };
}
