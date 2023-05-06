import { ApiCollection } from '../models/api/ApiCollection';
import { Photo } from '../models/api/Photo';
import { ExifDetail } from '../models/api/ExifDetail';
import { GpsDetail } from '../models/api/GpsDetail';
import { GpsCoordinate } from '../models/api/GpsCoordinate';
import { patchMawApi, postMawApi, queryMawApi } from './Shared';
import { Rating } from '../models/api/Rating';

export const getRandomPhoto = () =>
    queryMawApi<Photo>('photos/random');

export const getRandomPhotos = (count: number) =>
    queryMawApi<ApiCollection<Photo>>(`photos/random/${count}`);

export const getExifData = (photoId: number) =>
    queryMawApi<ExifDetail>(`photos/${photoId}/exif`);

export const getRating = (photoId: number) =>
    queryMawApi<Rating>(`photos/${photoId}/rating`);

export const ratePhoto = (photoId: number, rating: number) =>
    patchMawApi(`photos/${photoId}/rating`, { photoId, rating });

export const getComments = (photoId: number) =>
    queryMawApi<ApiCollection<Comment>>(`photos/${photoId}/comments`);

export const addComment = (photoId: number, comment: string) =>
    postMawApi(`photos/${photoId}/comments`, { comment });

export const getGpsDetail = (photoId: number) =>
    queryMawApi<GpsDetail>(`photos/${photoId}/gps`);

export const setGpsCoordinateOverride = (photoId: number, gps: GpsCoordinate) =>
    patchMawApi(`photos/${photoId}/gps`, gps);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
