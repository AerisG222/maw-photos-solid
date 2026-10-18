import { queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { GpsDetail } from "../../_models/GpsDetail";
import { Uuid } from "../../_models/Uuid";

/*
   The query definitions for categories: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchYears = async (getToken: GetToken) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<number[]>(accessToken, "categories/years")
    );

export const yearsQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.categories.years(),
        queryFn: () => fetchYears(getToken),
        staleTime: 15 * 60 * 1000
    });

export const categoriesForYearQueryOptions = (getToken: GetToken, year: number) => ({
    queryKey: queryKeys.categories.forYear(year),
    queryFn: () =>
        runWithAccessToken(getToken, async accessToken => {
            const categories = await queryApi<CategoryDto[]>(
                accessToken,
                `categories/years/${year}`
            );

            return { year, categories: categories.map(mapCategory) };
        }),
    staleTime: 1 * 60 * 1000
});

export const categoryQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () =>
        runWithAccessToken(getToken, async accessToken => {
            const category = await queryApi<CategoryDto>(accessToken, `categories/${id}`);

            return mapCategory(category);
        }),
    staleTime: 5 * 60 * 1000
});

export const categoryMediaQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.media(id),
    queryFn: () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Media[]>(accessToken, `categories/${id}/media`)
        ),
    staleTime: 5 * 60 * 1000
});

export const categoryMediaGpsQueryOptions = (getToken: GetToken, id: Uuid) => ({
    queryKey: queryKeys.categories.gps(id),
    queryFn: () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<GpsDetail[]>(accessToken, `categories/${id}/gps`)
        ),
    staleTime: 5 * 60 * 1000
});
