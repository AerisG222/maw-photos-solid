import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { PhotoCategory as ApiPhotoCategory } from './models/PhotoCategory';
import { Photo as ApiPhoto } from './models/Photo';
import { PhotoCategory } from '../models/Category';
import { getPhotoCategoryPath } from '../categories-photos/_routes';
import { Photo } from '../models/Photo';

export const getPhotoCategories = async (): Promise<PhotoCategory[]> => {
    const apiCategories = await internalGetPhotoCategories();

    return apiCategories.items.map(x => ({
        id: x.id,
        type: 'photo',
        name: x.name,
        year: x.year,
        createDate: x.createDate,
        teaserImageUrl: x.teaserImageSq.url,
        latitude: x.latitude,
        longitude: x.longitude,
        count: x.photoCount,
        totalSize: x.totalSize,
        isMissingGpsData: x.isMissingGpsData,
        route: getPhotoCategoryPath(x.id),
        downloadLink: x.downloadLink
    }));
}

export const getPhotos = async (categoryId: number): Promise<Photo[]> => {
    const apiPhotos = await internalGetPhotos(categoryId);

    return apiPhotos.items.map(x => ({
        id: x.id,
        categoryId: x.categoryId,
        createDate: x.createDate,
        latitude: x.latitude,
        longitude: x.longitude,
        imageXsUrl: x.imageXs.url,
        imageXsSqUrl: x.imageXsSq.url,
        imageSmUrl: x.imageSm.url,
        imageMdUrl: x.imageMd.url,
        imageLgUrl: x.imageLg.url,
        imagePrtUrl: x.imagePrt.url
    }));
}

const internalGetPhotoCategories = () =>
    queryMawApi<ApiCollection<ApiPhotoCategory>>('photo-categories');

const internalGetPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiPhoto>>(`photo-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
