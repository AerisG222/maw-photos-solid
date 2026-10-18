import { infiniteQueryOptions, queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { PersonMediaFilter } from "./_peopleQueries";
import { CategoryDto, mapCategory } from "../../_models/Category";
import { ClanDto, mapClan } from "../../_models/Clan";
import { Media } from "../../_models/Media";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   The query definitions for clans: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchClans = async (getToken: GetToken) =>
    runWithAccessToken(getToken, async accessToken => {
        const clans = await queryApi<ClanDto[]>(accessToken, "clans");

        return clans.map(mapClan);
    });

/*
   Identical in shape to the person feed, because it is the same feed - a
   clan matches media holding any of its members, and a photo with three of
   them still counts once.
*/
export const fetchClanMedia = async (
    getToken: GetToken,
    id: Uuid,
    offset: number,
    filter: PersonMediaFilter
) => {
    const params: Record<string, string> = { o: offset.toString() };

    if (filter.favoritesOnly) {
        params.f = "true";
    }

    if (filter.seed !== undefined) {
        params.seed = filter.seed.toString();
    }

    return runWithAccessToken(getToken, accessToken =>
        queryApi<SearchResults<Media>>(accessToken, `clans/${id}/media`, params)
    );
};

// the categories any member turns up in - the clan counterpart of the person
// list, and paged and filtered identically
export const fetchClanCategories = async (
    getToken: GetToken,
    id: Uuid,
    offset: number,
    favoritesOnly: boolean
) => {
    const params: Record<string, string> = { o: offset.toString() };

    if (favoritesOnly) {
        params.f = "true";
    }

    return runWithAccessToken(getToken, async accessToken => {
        const results = await queryApi<SearchResults<CategoryDto>>(
            accessToken,
            `clans/${id}/categories`,
            params
        );

        return { ...results, results: results.results.map(mapCategory) };
    });
};

export const clansQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.clans.all(),
        queryFn: () => fetchClans(getToken),
        staleTime: 5 * 60 * 1000
    });

export const clanMediaQueryOptions = (getToken: GetToken, id: Uuid, filter: PersonMediaFilter) =>
    infiniteQueryOptions({
        queryKey: queryKeys.clans.media(id, filter),
        queryFn: ({ pageParam }) => fetchClanMedia(getToken, id, pageParam, filter),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });

export const clanCategoriesQueryOptions = (getToken: GetToken, id: Uuid, favoritesOnly: boolean) =>
    infiniteQueryOptions({
        queryKey: queryKeys.clans.categories(id, { favoritesOnly }),
        queryFn: ({ pageParam }) => fetchClanCategories(getToken, id, pageParam, favoritesOnly),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });
