import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationResult,
    useQueries,
    useQuery,
    useQueryClient,
    UseQueryResult
} from "@tanstack/solid-query";
import { parseISO } from "date-fns";

import { useAuthContext } from "../AuthContext";
import { postApi, queryApi, runWithAccessToken } from "./_shared";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { SearchResults } from "../../_models/SearchResults";
import { GpsDetail } from "../../_models/GpsDetail";
import { Uuid } from "../../_models/Uuid";
import { CategoriesForYearResult } from "./models/CategoriesForYearResult";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";

export interface CategoriesService {
    yearsQuery: () => UseQueryResult<number[], Error>;
    categoriesForAllYearsQuery: (
        years: number[]
    ) => UseQueryResult<CategoriesForYearResult, Error>[];
    categoriesForYearQuery: (
        year: Accessor<number>
    ) => UseQueryResult<CategoriesForYearResult, Error>;
    categoryQuery: (id: Accessor<Uuid>) => UseQueryResult<Category | undefined, Error>;
    categoryMediaQuery: (id: Accessor<Uuid>) => UseQueryResult<Media[], Error>;
    categoryMediaGpsQuery: (id: Accessor<Uuid>) => UseQueryResult<GpsDetail[], Error>;
    categorySearchQuery: (
        query: string
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
    setIsFavoriteMutation: UseMutationResult<Response, Error, IsFavoriteRequest<Category>, unknown>;
}

const CategoriesContext = createContext<CategoriesService>();

export const CategoriesProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const cleanupDatesFromApi = (c: Category) => {
        c.effectiveDate = parseISO(c.effectiveDate as string);
        c.modified = parseISO(c.modified as string);
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

            return { year, categories };
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

    const fetchCategoryMediaGps = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<GpsDetail[]>(accessToken, `categories/${id}/gps`)
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

    const postIsFavorite = async (req: IsFavoriteRequest<Category>) =>
        runWithAccessToken(getToken, accessToken =>
            postApi(accessToken, `categories/${req.item.id}/favorite`, {
                isFavorite: req.isFavorite
            })
        );

    const yearsQuery = () =>
        useQuery(() => ({
            queryKey: ["categories", "years"],
            queryFn: fetchYears,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const categoriesForAllYearsQuery = (years: number[]) =>
        useQueries(() => ({
            queries: years.map(year => ({
                queryKey: ["categories", "year", year],
                queryFn: () => fetchCategoriesForYear(year),
                enabled: years && years.length > 0
            }))
        }));

    const categoriesForYearQuery = (year: Accessor<number>) =>
        useQuery(() => ({
            queryKey: ["categories", "year", year()],
            queryFn: () => fetchCategoriesForYear(year()),
            enabled: year() > 0 && authContext.isLoggedIn,
            staleTime: 1 * 60 * 1000
        }));

    const categoryQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["categories", id()],
            queryFn: () => fetchCategory(id()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const categoryMediaQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["categories", id(), "media"],
            queryFn: () => fetchCategoryMedia(id()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const categoryMediaGpsQuery = (id: Accessor<Uuid>) =>
        useQuery(() => ({
            queryKey: ["categories", id(), "gps"],
            queryFn: () => fetchCategoryMediaGps(id()),
            enabled: !!id() && authContext.isLoggedIn,
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

    const setIsFavoriteMutation = useMutation(() => ({
        mutationFn: (isFavoriteReq: IsFavoriteRequest<Category>) => postIsFavorite(isFavoriteReq),
        onSettled: async (response, error, request) => {
            const year = request.item.effectiveDate.getFullYear();
            const queryKey = ["categories", "year", year];

            await queryClient.invalidateQueries({
                queryKey,
                refetchType: "all"
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories", "search"],
                refetchType: "all"
            });
        }
    }));

    // todo: patchApi(`categories/${categoryId}/teaser`, { mediaId });

    return (
        <CategoriesContext.Provider
            value={{
                yearsQuery,
                categoriesForAllYearsQuery,
                categoriesForYearQuery,
                categoryQuery,
                categoryMediaQuery,
                categoryMediaGpsQuery,
                categorySearchQuery,
                setIsFavoriteMutation
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
