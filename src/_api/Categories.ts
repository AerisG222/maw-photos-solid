import { patchApi, queryApi } from "../_contexts/api/_shared";
import { Category } from "../_models/Category";
import { Media } from "../_models/Media";
import { SearchResults } from '../_models/SearchResults';

export const getYears = async (): Promise<number[]> =>
    (await queryApi<number[]>("categories/years")) ?? [];

export const getCategories = async (): Promise<Category[]> =>
    (await queryApi<Category[]>("categories")) ?? [];

export const getCategory = async (categoryId: Uuid): Promise<Category | undefined> =>
    queryApi<Category>(`categories/${categoryId}`);

export const getMedia = async (categoryId: Uuid): Promise<Media[]> =>
    (await queryApi<Media[]>(`categories/${categoryId}/media`)) ?? [];

export const setTeaser = (categoryId: Uuid, mediaId: Uuid) =>
    patchApi(`categories/${categoryId}/teaser`, { mediaId });

export const search = async (query: string, start: number) =>
    queryApi<SearchResults<Category>>("categories/search", { query, start });
