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

import { useAuthContext } from "../AuthContext";
import { queryKeys, queryKeyMatches } from "./_queryKeys";
import { deleteApi, postApi, putApi, queryApi, runWithAccessToken } from "./_shared";
import { patchById } from "./_cacheUtils";
import { Category, CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Place, PlaceAncestor, PlaceKind } from "../../_models/Place";
import {
    MergePlacesRequest,
    SetPlaceCoverRequest,
    SetPlaceParentRequest
} from "../../_models/PlaceRequest";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   Which slice of the place tree to list.

   The three fields are not independent, and the API is what decides that: a
   `search` matches names anywhere in the tree and makes `parentId` irrelevant,
   because the duplicates worth finding sit in *different* branches. `kind`
   applies either way, so "every city called Zhuhai" is one request.
*/
export interface PlaceFilter {
    // undefined lists the countries - the root of the tree
    parentId: Uuid | undefined;
    kind: PlaceKind | undefined;
    // already trimmed by the caller; blank means "not searching"
    search: string;
}

/*
   How the cover picker narrows and orders what it is choosing from.

   A country holds tens of thousands of photographs, so paging from the newest
   one is no way to find something that represents it. Favorites are where a good
   candidate usually is, and `seed` samples the rest: the API orders by a hash of
   the media id and the seed, so a shuffle stays consistent across pages instead
   of repeating and skipping rows. Undefined means the default, newest first.
*/
export interface PlaceMediaFilter {
    favoritesOnly: boolean;
    seed: number | undefined;
}

/*
   Places, and the administration of them.

   The reads are shared with browsing when that arrives; the writes are the admin
   surface - a hand picked cover, and the two corrections for a tree that is only
   ever as good as the geocoder that derived it.
*/
export interface PlacesService {
    placesQuery: (filter: Accessor<PlaceFilter>) => UseQueryResult<Place[], Error>;
    placeQuery: (id: Accessor<Uuid | undefined>) => UseQueryResult<Place, Error>;
    /*
       Several places at once, by id - the chain above the one being looked at.

       Keyed exactly as `placeQuery` keys a single place, which is the point:
       drilling down reads each level on the way through, so walking back up finds
       the whole chain already cached and only a deep link pays for it - at most
       two small requests, since the tree is three deep.
    */
    placesByIdQuery: (ids: Accessor<Uuid[]>) => UseQueryResult<Place, Error>[];
    placeAncestorsQuery: (id: Accessor<Uuid | undefined>) => UseQueryResult<PlaceAncestor[], Error>;
    placeMediaQuery: (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PlaceMediaFilter>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;
    // the reverse read: the country, state and city one media was taken at, so a
    // screen showing the photograph can offer it as any of their covers
    mediaPlacesQuery: (mediaId: Accessor<Uuid | undefined>) => UseQueryResult<Place[], Error>;
    placeCategoriesQuery: (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
    setCoverMutation: UseMutationResult<Place, Error, SetPlaceCoverRequest, unknown>;
    clearCoverMutation: UseMutationResult<Place, Error, Uuid, unknown>;
    mergePlacesMutation: UseMutationResult<Place, Error, MergePlacesRequest, unknown>;
    setParentMutation: UseMutationResult<Place, Error, SetPlaceParentRequest, unknown>;
}

const PlacesContext = createContext<PlacesService>();

export const PlacesProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const fetchPlaces = async (filter: PlaceFilter) => {
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

    const fetchPlace = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken => queryApi<Place>(accessToken, `places/${id}`));

    const fetchPlaceAncestors = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<PlaceAncestor[]>(accessToken, `places/${id}/ancestors`)
        );

    /*
       Everything at a place *and beneath it*, which is what makes this the right
       list to pick a cover from: a country's photographs are the ones eligible
       to represent it, wherever in its states and cities they were taken.
    */
    const fetchPlaceMedia = async (id: Uuid, offset: number, filter: PlaceMediaFilter) => {
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
    const fetchPlaceCategories = async (id: Uuid, offset: number, favoritesOnly: boolean) => {
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

    const fetchMediaPlaces = async (mediaId: Uuid) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Place[]>(accessToken, `media/${mediaId}/places`)
        );

    // every write answers with the place as it now stands, so a screen shows the
    // result of what it just did rather than re-reading it
    const readPlace = async (response: Response) => (await response.json()) as Place;

    const putCover = async (req: SetPlaceCoverRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readPlace(
                await putApi(accessToken, `places/${req.placeId}/cover`, { mediaId: req.mediaId })
            )
        );

    const removeCover = async (placeId: Uuid) =>
        runWithAccessToken(getToken, async accessToken =>
            readPlace(await deleteApi(accessToken, `places/${placeId}/cover`))
        );

    const postMerge = async (req: MergePlacesRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readPlace(
                await postApi(accessToken, `places/${req.placeId}/merge`, {
                    sourceId: req.sourceId
                })
            )
        );

    const putParent = async (req: SetPlaceParentRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readPlace(
                await putApi(accessToken, `places/${req.placeId}/parent`, {
                    parentId: req.parentId
                })
            )
        );

    const placesQuery = (filter: Accessor<PlaceFilter>) =>
        useQuery(() => ({
            queryKey: queryKeys.places.list({
                parentId: filter().search ? undefined : filter().parentId,
                kind: filter().kind,
                search: filter().search || undefined
            }),
            queryFn: () => fetchPlaces(filter()),
            enabled: authContext.isLoggedIn,
            /*
               Short, unlike the people list. The tree is a few hundred nodes and
               the whole point of this screen is to change it - a merge that left
               the listing it was launched from showing the place it just deleted
               would read as a failure.
            */
            staleTime: 30 * 1000
        }));

    const placeQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            queryKey: queryKeys.places.detail(id()),
            queryFn: () => fetchPlace(id()!),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 30 * 1000
        }));

    const placesByIdQuery = (ids: Accessor<Uuid[]>) =>
        useQueries(() => ({
            queries: ids().map(id => ({
                queryKey: queryKeys.places.detail(id),
                queryFn: () => fetchPlace(id),
                enabled: authContext.isLoggedIn,
                staleTime: 30 * 1000
            }))
        }));

    const placeAncestorsQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            queryKey: queryKeys.places.ancestors(id()),
            queryFn: () => fetchPlaceAncestors(id()!),
            enabled: !!id() && authContext.isLoggedIn,
            // the chain of names above a place moves only when the tree is
            // reshaped, which invalidates this along with everything else
            staleTime: 5 * 60 * 1000
        }));

    const placeMediaQuery = (id: Accessor<Uuid | undefined>, filter: Accessor<PlaceMediaFilter>) =>
        useInfiniteQuery(() => ({
            queryKey: [...queryKeys.places.media(id()), filter()],
            queryFn: data => fetchPlaceMedia(id()!, data.pageParam, filter()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    /*
       Empty is a real answer here, not a failure: a photograph with no location,
       one never geocoded, and one the caller cannot see all come back the same
       way, which is what stops this being a probe for either.
    */
    const mediaPlacesQuery = (mediaId: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            queryKey: queryKeys.media.places(mediaId()),
            queryFn: () => fetchMediaPlaces(mediaId()!),
            enabled: !!mediaId() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const placeCategoriesQuery = (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) =>
        useInfiniteQuery(() => ({
            queryKey: queryKeys.places.categories(id(), { favoritesOnly: favoritesOnly() }),
            queryFn: data => fetchPlaceCategories(id()!, data.pageParam, favoritesOnly()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    /*
       A cover changes one place and nothing about the shape of the tree, so the
       listings holding it are patched rather than refetched - see the note in
       _cacheUtils for why a tile's object identity is worth preserving. The url
       carries a `?v=` stamped when the cover was published, so the new image is
       fetched rather than the replaced one being served from cache.
    */
    const applyPlaceCover = (place: Place) => {
        queryClient.setQueryData<Place>(queryKeys.places.detail(place.id), place);

        queryClient.setQueriesData<Place[]>(
            {
                predicate: query =>
                    queryKeyMatches.placeList(query.queryKey) ||
                    // the sidebar publishes covers from the media it is showing,
                    // so its chain holds the same places the admin listings do
                    queryKeyMatches.mediaPlaces(query.queryKey)
            },
            prev =>
                prev
                    ? patchById(prev, place.id, {
                          coverUrl: place.coverUrl,
                          coverMediaId: place.coverMediaId
                      })
                    : prev
        );
    };

    /*
       Merging and re-parenting move media between places and can empty a place
       out of the listing entirely, so every count and every membership on screen
       is now suspect - there is nothing to patch, and the whole area is dropped
       instead.

       Deliberately not awaited: an `onSuccess` that returns a promise holds the
       mutation open until it settles, which would leave a dialog sitting there
       after the work it was waiting on had already succeeded.
    */
    const invalidatePlaces = () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.places.all() });

        // a merged place can be the one a media's chain named, so those go too
        void queryClient.invalidateQueries({
            predicate: query => queryKeyMatches.mediaPlaces(query.queryKey)
        });
    };

    const setCoverMutation = useMutation(() => ({
        mutationFn: (req: SetPlaceCoverRequest) => putCover(req),
        onSuccess: applyPlaceCover
    }));

    const clearCoverMutation = useMutation(() => ({
        mutationFn: (placeId: Uuid) => removeCover(placeId),
        onSuccess: applyPlaceCover
    }));

    const mergePlacesMutation = useMutation(() => ({
        mutationFn: (req: MergePlacesRequest) => postMerge(req),
        onSuccess: invalidatePlaces
    }));

    const setParentMutation = useMutation(() => ({
        mutationFn: (req: SetPlaceParentRequest) => putParent(req),
        onSuccess: invalidatePlaces
    }));

    return (
        <PlacesContext.Provider
            value={{
                placesQuery,
                placeQuery,
                placesByIdQuery,
                placeAncestorsQuery,
                placeMediaQuery,
                placeCategoriesQuery,
                mediaPlacesQuery,
                setCoverMutation,
                clearCoverMutation,
                mergePlacesMutation,
                setParentMutation
            }}
        >
            {props.children}
        </PlacesContext.Provider>
    );
};

export const usePlacesContext = () => {
    const ctx = useContext(PlacesContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Places context not provided by ancestor component!");
};
