import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQuery,
    UseQueryResult
} from "@tanstack/solid-query";

import { useAuthContext } from "../AuthContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { SearchResults } from "../../_models/SearchResults";

export type CategoriesService = {
    yearsQuery: () => UseQueryResult<number[], Error>;
    categoriesForYearQuery: (year: Accessor<number>) => UseQueryResult<Category[], Error>;
    categoryQuery: (id: Accessor<Uuid>) => UseQueryResult<Category, Error>;
    categoryMediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media[], Error>;
    categorySearchQuery: (
        query: string
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
};

const CategoriesContext = createContext<CategoriesService>();

export const CategoriesProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const cleanupDatesFromApi = (c: Category) => {
        c.effectiveDate = new Date(c.effectiveDate);
        c.modified = new Date(c.modified);
    };

    const fetchYears = async () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<number[]>(accessToken, "categories/years")
        );

    const fetchCategoriesForYear = async (year: number) =>
        runWithAccessToken(getToken, async accessToken => {
            const categories = await queryApi<Category[]>(accessToken, `categories/years/${year}`);

            for (const c of categories) {
                cleanupDatesFromApi(c);
            }

            return categories;
        });

    const fetchCategory = async (id: Uuid) =>
        runWithAccessToken(getToken, async accessToken => {
            const category = await queryApi<Category>(accessToken, `categories/${id}`);

            cleanupDatesFromApi(category);

            return category;
        });

    const fetchCategoryMedia = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Media[]>(accessToken, `categories/${id}/media`)
        );

    const fetchCategorySearch = async (
        query: string,
        startOffset: number
    ): Promise<SearchResults<Category> | undefined> => {
        if (!query) {
            return undefined;
        }

        return runWithAccessToken(getToken, async accessToken => {
            const searchResults = await queryApi<SearchResults<Category>>(
                accessToken,
                `categories/search?s=${encodeURI(query)}&o=${startOffset}`
            );

            for (const c of searchResults.results) {
                cleanupDatesFromApi(c);
            }

            return searchResults;
        });
    };

    const yearsQuery = () =>
        useQuery(() => ({
            queryKey: ["categories", "years"],
            queryFn: fetchYears,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const categoriesForYearQuery = (year: Accessor<number>) =>
        useQuery(() => ({
            queryKey: ["categories", "year", year()],
            queryFn: () => fetchCategoriesForYear(year()),
            enabled: authContext.isLoggedIn,
            staleTime: 1 * 60 * 1000
        }));

    const categoryQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["categories", id()],
            queryFn: () => fetchCategory(id()),
            enabled: authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const categoryMediaQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["categories", id(), "media"],
            queryFn: () => fetchCategoryMedia(id()),
            enabled: authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const categorySearchQuery = (query: string) =>
        useInfiniteQuery(() => ({
            queryKey: ["categories", "search", query],
            queryFn: data => fetchCategorySearch(query, data.pageParam),
            enabled: authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    // todo: patchApi(`categories/${categoryId}/teaser`, { mediaId });

    return (
        <CategoriesContext.Provider
            value={{
                yearsQuery,
                categoriesForYearQuery,
                categoryQuery,
                categoryMediaQuery,
                categorySearchQuery
            }}
        >
            {props.children}
        </CategoriesContext.Provider>
    );
};

export const useCategoriesContext = () => {
    const ctx = useContext(CategoriesContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Categories context not provided by ancestor component!");
};
function cleanupDatesFromApi(category: Category) {
    throw new Error("Function not implemented.");
}
