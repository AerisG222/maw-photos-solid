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
import {
    PlaceFilter,
    PlaceMediaFilter,
    mediaPlacesQueryOptions,
    placeAncestorsQueryOptions,
    placeCategoriesQueryOptions,
    placeMediaQueryOptions,
    placeQueryOptions,
    placesQueryOptions
} from "./_placesQueries";
import { deleteApi, postApi, putApi, runWithAccessToken } from "./_shared";
import { patchById } from "./_cacheUtils";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Place, PlaceAncestor } from "../../_models/Place";
import {
    MergePlacesRequest,
    SetPlaceCoverRequest,
    SetPlaceParentRequest
} from "../../_models/PlaceRequest";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

export type { PlaceFilter, PlaceMediaFilter } from "./_placesQueries";

/*
   Which slice of the place tree to list.

   The three fields are not independent, and the API is what decides that: a
   `search` matches names anywhere in the tree and makes `parentId` irrelevant,
   because the duplicates worth finding sit in *different* branches. `kind`
   applies either way, so "every city called Zhuhai" is one request.
*/

/*
   How the cover picker narrows and orders what it is choosing from.

   A country holds tens of thousands of photographs, so paging from the newest
   one is no way to find something that represents it. Favorites are where a good
   candidate usually is, and `seed` samples the rest: the API orders by a hash of
   the media id and the seed, so a shuffle stays consistent across pages instead
   of repeating and skipping rows. Undefined means the default, newest first.
*/

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
            ...placesQueryOptions(getToken, filter()),
            enabled: authContext.isLoggedIn
        }));

    const placeQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            ...placeQueryOptions(getToken, id()!),
            enabled: !!id() && authContext.isLoggedIn
        }));

    const placesByIdQuery = (ids: Accessor<Uuid[]>) =>
        useQueries(() => ({
            queries: ids().map(id => ({
                ...placeQueryOptions(getToken, id),
                enabled: authContext.isLoggedIn
            }))
        }));

    const placeAncestorsQuery = (id: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            ...placeAncestorsQueryOptions(getToken, id()!),
            enabled: !!id() && authContext.isLoggedIn
        }));

    const placeMediaQuery = (id: Accessor<Uuid | undefined>, filter: Accessor<PlaceMediaFilter>) =>
        useInfiniteQuery(() => ({
            ...placeMediaQueryOptions(getToken, id()!, filter()),
            enabled: !!id() && authContext.isLoggedIn
        }));

    /*
       Empty is a real answer here, not a failure: a photograph with no location,
       one never geocoded, and one the caller cannot see all come back the same
       way, which is what stops this being a probe for either.
    */
    const mediaPlacesQuery = (mediaId: Accessor<Uuid | undefined>) =>
        useQuery(() => ({
            ...mediaPlacesQueryOptions(getToken, mediaId()!),
            enabled: !!mediaId() && authContext.isLoggedIn
        }));

    const placeCategoriesQuery = (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) =>
        useInfiniteQuery(() => ({
            ...placeCategoriesQueryOptions(getToken, id()!, favoritesOnly()),
            enabled: !!id() && authContext.isLoggedIn
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
