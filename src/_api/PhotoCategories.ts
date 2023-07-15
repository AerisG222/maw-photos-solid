import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './_models/ApiCollection';
import { PhotoCategory as ApiPhotoCategory } from './_models/PhotoCategory';
import { Photo as ApiPhoto } from './_models/Photo';
import { PhotoCategory } from '../_models/Category';
import { CategoryTypePhotos } from '../_models/CategoryType';
import { MediaTypePhoto, Photo } from '../_models/Media';
import { getCategoryPath } from '../categories/_routes';

export const getPhotoCategories = async (): Promise<PhotoCategory[]> => {
    const apiCategories = await internalGetPhotoCategories();

    return apiCategories.items.map(x => ({
        id: x.id,
        type: CategoryTypePhotos,
        name: x.name,
        year: x.year,
        createDate: x.createDate,
        teaserImageUrl: x.teaserImageSq.url,
        latitude: x.latitude,
        longitude: x.longitude,
        count: x.photoCount,
        totalSize: x.totalSize,
        isMissingGpsData: x.isMissingGpsData,
        route: getCategoryPath(CategoryTypePhotos, x.id),
        downloadLink: x.downloadLink
    }));
};

export const getPhotos = async (categoryId: number): Promise<Photo[]> => {
    const apiPhotos = await internalGetPhotos(categoryId);

    return apiPhotos.items.map(x => ({
        kind: MediaTypePhoto,
        id: x.id,
        categoryId: x.categoryId,
        createDate: x.createDate,
        latitude: x.latitude,
        longitude: x.longitude,
        imageXsUrl: x.imageXs.url,
        imageXsWidth: x.imageXs.width,
        imageXsSqUrl: x.imageXsSq.url,
        imageSmUrl: x.imageSm.url,
        imageSmWidth: x.imageSm.width,
        imageMdUrl: x.imageMd.url,
        imageMdWidth: x.imageMd.width,
        imageLgUrl: x.imageLg.url,
        imageLgWidth: x.imageLg.width,
        imagePrtUrl: x.imagePrt.url
    }));
};

const internalGetPhotoCategories = () =>
    queryMawApi<ApiCollection<ApiPhotoCategory>>('photo-categories');

const internalGetPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiPhoto>>(`photo-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
