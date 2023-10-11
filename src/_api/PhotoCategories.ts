import { patchMawApi, queryMawApi } from "./Shared";
import { ApiCollection } from "./models/ApiCollection";
import { PhotoCategory as ApiPhotoCategory } from "./models/PhotoCategory";
import { Photo as ApiPhoto } from "./models/Photo";
import { PhotoCategory } from "../_models/Category";
import { CategoryTypePhotos } from "../_models/CategoryType";
import { getCategoryPath } from "../categories/_routes";
import { toDomainPhoto } from "./Photos";
import { Photo } from "../_models/Media";

const mapApiPhotoCategory = (cat: ApiPhotoCategory): PhotoCategory => ({
    id: cat.id,
    type: CategoryTypePhotos,
    name: cat.name,
    year: cat.year,
    createDate: cat.createDate,
    teaserImageUrl: cat.teaserImageSq.url,
    latitude: cat.latitude,
    longitude: cat.longitude,
    count: cat.photoCount,
    totalSize: cat.totalSize,
    isMissingGpsData: cat.isMissingGpsData,
    route: getCategoryPath(CategoryTypePhotos, cat.id),
    downloadLink: cat.downloadLink
});

export const getPhotoCategories = async (): Promise<PhotoCategory[]> => {
    const apiCategories = await internalGetPhotoCategories();

    return apiCategories.items.map(mapApiPhotoCategory);
};

export const getPhotoCategory = async (categoryId: number): Promise<PhotoCategory> => {
    const category = await internalGetPhotoCategory(categoryId);

    return mapApiPhotoCategory(category);
};

export const getPhotos = async (categoryId: number): Promise<Photo[]> => {
    const apiPhotos = await internalGetPhotos(categoryId);

    return apiPhotos.items.map(x => toDomainPhoto(x));
};

const internalGetPhotoCategories = () =>
    queryMawApi<ApiCollection<ApiPhotoCategory>>("photo-categories");

const internalGetPhotoCategory = (categoryId: number) =>
    queryMawApi<ApiPhotoCategory>(`photo-categories/${categoryId}`);

const internalGetPhotos = (categoryId: number) =>
    queryMawApi<ApiCollection<ApiPhoto>>(`photo-categories/${categoryId}/photos`);

export const setTeaser = (categoryId: number, photoId: number) =>
    patchMawApi(`photo-categories/${categoryId}/teaser`, { photoId });
