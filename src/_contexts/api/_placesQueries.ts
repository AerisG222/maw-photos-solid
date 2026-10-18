import { infiniteQueryOptions, QueryClient, queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Place, PlaceAncestor, PlaceKind } from "../../_models/Place";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   The query definitions for places: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export interface PlaceFilter {
    // undefined lists the countries - the root of the tree
    parentId: Uuid | undefined;
    kind: PlaceKind | undefined;
    // already trimmed by the caller; blank means "not searching"
    search: string;
}

export interface PlaceMediaFilter {
    favoritesOnly: boolean;
    seed: number | undefined;
}

export const fetchPlaces = async (getToken: GetToken, filter: PlaceFilter) => {
    // omitted rather than sent empty, so each url is the one the API
    // documents for the listing being asked for
    const params: Record<string, string> = {};

    if (filter.search) {
        params.q = filter.search;
    } else if (filter.parentId) {
        params.parent = filter.parentId;
    }

    if (filter.kind) {
        params.kind = filter.kind;
    }

    return runWithAccessToken(getToken, accessToken =>
        queryApi<Place[]>(accessToken, "places", params)
    );
};

export const fetchPlace = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, accessToken => queryApi<Place>(accessToken, `places/${id}`));

export const fetchPlaceAncestors = async (getToken: GetToken, id: Uuid) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<PlaceAncestor[]>(accessToken, `places/${id}/ancestors`)
    );

/*
   Everything at a place *and beneath it*, which is what makes this the right
   list to pick a cover from: a country's photographs are the ones eligible
   to represent it, wherever in its states and cities they were taken.
*/
export const fetchPlaceMedia = async (
    getToken: GetToken,
    id: Uuid,
    offset: number,
    filter: PlaceMediaFilter
) => {
    const params: Record<string, string> = { o: offset.toString() };

    if (filter.favoritesOnly) {
        params.f = "true";
    }

    if (filter.seed !== undefined) {
        params.seed = filter.seed.toString();
    }

    return runWithAccessToken(getToken, accessToken =>
        queryApi<SearchResults<Media>>(accessToken, `places/${id}/media`, params)
    );
};

/*
   The same media, rolled up to the categories holding it.

   A cover is being chosen from tens of thousands of photographs, and the
   fastest way to a good one is usually to remember which outing it was on -
   so the picker offers the trips as well as the photographs. Paged and
   filtered like the media, but with no seed: a shuffled list of categories
   would mean nothing.
*/
export const fetchPlaceCategories = async (
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
            `places/${id}/categories`,
            params
        );

        return { ...results, results: results.results.map(mapCategory) };
    });
};

/*
   Short, unlike the people list. The tree is a few hundred nodes and the whole
   point of its screen is to change it - a merge that left the listing it was
   launched from showing the place it just deleted would read as a failure.
*/
export const placesQueryOptions = (getToken: GetToken, filter: PlaceFilter) =>
    queryOptions({
        queryKey: queryKeys.places.list({
            parentId: filter.search ? undefined : filter.parentId,
            kind: filter.kind,
            search: filter.search || undefined
        }),
        queryFn: () => fetchPlaces(getToken, filter),
        staleTime: 30 * 1000
    });

export const placeQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.places.detail(id),
        queryFn: () => fetchPlace(getToken, id),
        staleTime: 30 * 1000
    });

// the chain of names above a place moves only when the tree is reshaped, which
// invalidates this along with everything else
export const placeAncestorsQueryOptions = (getToken: GetToken, id: Uuid) =>
    queryOptions({
        queryKey: queryKeys.places.ancestors(id),
        queryFn: () => fetchPlaceAncestors(getToken, id),
        staleTime: 5 * 60 * 1000
    });

export const placeMediaQueryOptions = (getToken: GetToken, id: Uuid, filter: PlaceMediaFilter) =>
    infiniteQueryOptions({
        queryKey: [...queryKeys.places.media(id), filter],
        queryFn: ({ pageParam }) => fetchPlaceMedia(getToken, id, pageParam, filter),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });

export const placeCategoriesQueryOptions = (getToken: GetToken, id: Uuid, favoritesOnly: boolean) =>
    infiniteQueryOptions({
        queryKey: queryKeys.places.categories(id, { favoritesOnly }),
        queryFn: ({ pageParam }) => fetchPlaceCategories(getToken, id, pageParam, favoritesOnly),
        staleTime: 5 * 60 * 1000,
        initialPageParam: 0,
        getNextPageParam: (
            lastPage: { hasMoreResults: boolean; nextOffset: number } | undefined
        ) => (lastPage?.hasMoreResults ? lastPage.nextOffset : undefined)
    });

/*
   The chain above a place, as the strip at the top of its screens draws it: the
   ancestors in order, then each one's cover and count. Two steps that cannot be
   one - the ancestors are what say which places to read - so this starts the
   second the moment the first answers.
*/
export const prefetchPlaceChain = async (
    queryClient: QueryClient,
    getToken: GetToken,
    id: Uuid
) => {
    const ancestors = await queryClient.ensureQueryData(placeAncestorsQueryOptions(getToken, id));

    await Promise.all(
        ancestors.map(ancestor =>
            queryClient.prefetchQuery(placeQueryOptions(getToken, ancestor.id))
        )
    );
};
