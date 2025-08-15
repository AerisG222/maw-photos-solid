import { patchMawApi, queryMawApi } from "./Shared";
import { Category } from "../_models/Category";
import { Media } from "../_models/Media";
import { SearchResults } from '../_models/SearchResults';

export const getYears = async (): Promise<number[]> =>
    (await queryMawApi<number[]>("categories/years")) ?? [];

export const getCategories = async (): Promise<Category[]> =>
    (await queryMawApi<Category[]>("categories")) ?? [];

export const getCategory = async (categoryId: Uuid): Promise<Category | undefined> =>
    queryMawApi<Category>(`categories/${categoryId}`);

export const getMedia = async (categoryId: Uuid): Promise<Media[]> =>
    (await queryMawApi<Media[]>(`categories/${categoryId}/media`)) ?? [];

export const setTeaser = (categoryId: Uuid, mediaId: Uuid) =>
    patchMawApi(`categories/${categoryId}/teaser`, { mediaId });

export const search = async (query: string, start: number) =>
    queryMawApi<SearchResults<Category>>("categories/search", { query, start });
