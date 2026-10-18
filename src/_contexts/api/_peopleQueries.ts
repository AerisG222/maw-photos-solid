import { infiniteQueryOptions, queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   The query definitions for people: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export interface PersonMediaFilter {
    favoritesOnly: boolean;
    seed: number | undefined;
}

export const fetchPeople = async (getToken: GetToken) =>
    runWithAccessToken(getToken, accessToken => queryApi<Person[]>(accessToken, "persons"));

export const fetchPersonMedia = async (
    getToken: GetToken,
    id: Uuid,
    offset: number,
    filter: PersonMediaFilter
) => {
    // omitted rather than sent as their defaults, so the url stays the one
    // the API documents for an unfiltered feed
    const params: Record<string, string> = { o: offset.toString() };

    if (filter.favoritesOnly) {
        params.f = "true";
    }

    if (filter.seed !== undefined) {
        params.seed = filter.seed.toString();
    }

    return runWithAccessToken(getToken, accessToken =>
        queryApi<SearchResults<Media>>(accessToken, `persons/${id}/media`, params)
    );
};

/*
   The categories a person turns up in, as an alternative to the media
   itself. Paged like the media feed and filtered the same way, but with no
   seed - a shuffled list of categories would mean nothing.
*/
export const fetchPersonCategories = async (
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
            `persons/${id}/categories`,
            params
        );

        return { ...results, results: results.results.map(mapCategory) };
    });
};

export const peopleQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.people.all(),
        queryFn: () => fetchPeople(getToken),
        staleTime: 15 * 60 * 1000
    });

export const personMediaQueryOptions = (getToken: GetToken, id: Uuid, filter: PersonMediaFilter) =>
    infiniteQueryOptions({
        queryKey: queryKeys.people.media(id, filter),
        queryFn: ({ pageParam }) => fetchPersonMedia(getToken, id, pageParam, filter),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });

export const personCategoriesQueryOptions = (
    getToken: GetToken,
    id: Uuid,
    favoritesOnly: boolean
) =>
    infiniteQueryOptions({
        queryKey: queryKeys.people.categories(id, { favoritesOnly }),
        queryFn: ({ pageParam }) => fetchPersonCategories(getToken, id, pageParam, favoritesOnly),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });
