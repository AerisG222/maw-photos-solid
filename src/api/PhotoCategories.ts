import { queryMawApi } from './Shared';
import { ApiCollection } from '../models/api/ApiCollection';
import { PhotoCategory } from '../models/api/PhotoCategory';
import { Photo } from '../models/api/Photo';

export const getPhotoCategories = () =>
    queryMawApi<ApiCollection<PhotoCategory>>('photo-categories');

export const getPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<Photo>>(`photo-categories/${categoryId}/photos`);
