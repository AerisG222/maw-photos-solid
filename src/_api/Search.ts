import { queryMawApi } from "./Shared";
import { Category } from '../_models/Category';
import { SearchResults } from '../_models/SearchResults';

export const searchCategories = async (query: string, start: number) => await internalSearchCategories(query, start);

const internalSearchCategories = (query: string, start: number) =>
    queryMawApi<SearchResults<Category>>("categories/search", { query, start });
