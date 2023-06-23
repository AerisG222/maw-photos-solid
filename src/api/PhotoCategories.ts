import { patchMawApi, queryMawApi } from './Shared';
import { ApiCollection } from './models/ApiCollection';
import { PhotoCategory } from './models/PhotoCategory';
import { Photo } from './models/Photo';

export const getPhotoCategories = () =>
    queryMawApi<ApiCollection<PhotoCategory>>('photo-categories');

export const getPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<Photo>>(`photo-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
