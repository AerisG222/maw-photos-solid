import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { PhotoCategory as ApiPhotoCategory } from './models/PhotoCategory';
import { Photo as ApiPhoto } from './models/Photo';
import { PhotoCategory } from '../_models/Category';
import { CategoryTypePhotos } from '../_models/CategoryType';
import { getCategoryPath } from '../categories/_routes';
import { toDomainPhoto } from './Photos';
import { Photo } from '../_models/Media';

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

    return apiPhotos.items.map(x => toDomainPhoto(x));
};

const internalGetPhotoCategories = () =>
    queryMawApi<ApiCollection<ApiPhotoCategory>>('photo-categories');

const internalGetPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiPhoto>>(`photo-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
