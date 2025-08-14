import { patchMawApi, queryMawApi } from "./Shared";
import { Category } from '../_models/Category';
import { Media } from "../_models/Media";

export const getCategories = async (): Promise<Category[]> => await internalGetCategories();

export const getCategory = async (categoryId: Uuid): Promise<Category | undefined> => await internalGetCategory(categoryId);

export const getMedia = async (categoryId: Uuid): Promise<Media[]> => await internalGetMedia(categoryId);

const internalGetCategories = async () =>
    (await queryMawApi<Category[]>("categories")) ?? [];

const internalGetCategory = (categoryId: Uuid) =>
    queryMawApi<Category>(`categories/${categoryId}`);

const internalGetMedia = async (categoryId: Uuid) =>
    (await queryMawApi<Media[]>(`categories/${categoryId}/media`)) ?? [];

export const setTeaser = (categoryId: Uuid, mediaId: Uuid) =>
    patchMawApi(`categories/${categoryId}/teaser`, { mediaId });
