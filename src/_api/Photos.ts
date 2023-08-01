import { ApiCollection } from "./models/ApiCollection";
import { Photo as ApiPhoto } from "./models/Photo";
import { Comment } from "./models/Comment";
import { ExifDetail } from "./models/ExifDetail";
import { ApiGpsDetail } from "./models/ApiGpsDetail";
import { ApiGpsCoordinate } from "./models/ApiGpsCoordinate";
import { patchMawApi, postMawApi, queryMawApi } from "./Shared";
import { Rating } from "./models/Rating";
import { MediaTypePhoto, Photo } from "../_models/Media";

export const getRandomPhotos = async (count: number): Promise<Photo[]> => {
    const photos = await internalGetRandomPhotos(count);

    return photos.items.map(p => toDomainPhoto(p));
}

export const getExifData = (photoId: number) =>
    queryMawApi<ExifDetail>(`photos/${photoId}/exif`);

export const getRating = (photoId: number) =>
    queryMawApi<Rating>(`photos/${photoId}/rating`);

export const ratePhoto = (photoId: number, rating: number) =>
    patchMawApi(`photos/${photoId}/rating`, { photoId, rating });

export const getComments = async (photoId: number) => {
    const comments = await queryMawApi<ApiCollection<Comment>>(`photos/${photoId}/comments`);

    for(let c of comments.items) {
        c.entryDate = c.entryDate ? new Date(c.entryDate) : null
    }

    return comments;
}

export const addComment = (photoId: number, comment: string) =>
    postMawApi(`photos/${photoId}/comments`, { comment });

export const getGpsDetail = (photoId: number) =>
    queryMawApi<ApiGpsDetail>(`photos/${photoId}/gps`);

export const setGpsCoordinateOverride = (photoId: number, gps: ApiGpsCoordinate) =>
    patchMawApi(`photos/${photoId}/gps`, gps);

export const toDomainPhoto = (apiPhoto: ApiPhoto): Photo => ({
    kind: MediaTypePhoto,
    id: apiPhoto.id,
    categoryId: apiPhoto.categoryId,
    createDate: apiPhoto.createDate,
    latitude: apiPhoto.latitude,
    longitude: apiPhoto.longitude,
    imageXsUrl: apiPhoto.imageXs.url,
    imageXsWidth: apiPhoto.imageXs.width,
    imageXsSqUrl: apiPhoto.imageXsSq.url,
    imageSmUrl: apiPhoto.imageSm.url,
    imageSmWidth: apiPhoto.imageSm.width,
    imageMdUrl: apiPhoto.imageMd.url,
    imageMdWidth: apiPhoto.imageMd.width,
    imageLgUrl: apiPhoto.imageLg.url,
    imageLgWidth: apiPhoto.imageLg.width,
    imagePrtUrl: apiPhoto.imagePrt.url
});

const internalGetRandomPhotos = (count: number) =>
    queryMawApi<ApiCollection<ApiPhoto>>(`photos/random/${count}`);
