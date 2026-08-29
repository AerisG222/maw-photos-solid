import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
    UseQueryResult
} from "@tanstack/solid-query";

import { useAuthContext } from "../AuthContext";
import { queryKeys } from "./_queryKeys";
import { putApi, queryApi, runWithAccessToken } from "./_shared";
import { patchById } from "./_cacheUtils";
import { pulseFavorite } from "../../_components/icon/_favoritePulse";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { Category, CategoryDto, mapCategory } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   How a person's feed is narrowed and ordered.

   `seed` is a seed rather than a "shuffle" flag because the feed is paged: the
   API orders by a hash of the media id and this seed, so the same seed always
   yields the same order. A fresh shuffle per request would make page two repeat
   and skip rows from page one. Undefined means the default, newest first.
*/
export interface PersonMediaFilter {
    favoritesOnly: boolean;
    seed: number | undefined;
}

/*
   People, as detected by the face recognition pipeline.

   The API calls the resource "persons"; the app says "people" everywhere the
   user can see, so the naming splits at this boundary and nowhere else.
*/
export interface PeopleService {
    // `enabled` is for callers that only sometimes need the list - the face
    // overlay mounts with every photo but fetches nothing until switched on
    peopleQuery: (enabled?: Accessor<boolean>) => UseQueryResult<Person[], Error>;
    personMediaQuery: (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PersonMediaFilter>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;
    personCategoriesQuery: (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
    setIsFavoriteMutation: UseMutationResult<Response, Error, IsFavoriteRequest<Person>, unknown>;
}

const PeopleContext = createContext<PeopleService>();

export const PeopleProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const fetchPeople = async () =>
        runWithAccessToken(getToken, accessToken => queryApi<Person[]>(accessToken, "persons"));

    const fetchPersonMedia = async (id: Uuid, offset: number, filter: PersonMediaFilter) => {
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
    const fetchPersonCategories = async (id: Uuid, offset: number, favoritesOnly: boolean) => {
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

    const postIsFavorite = async (req: IsFavoriteRequest<Person>) =>
        runWithAccessToken(getToken, accessToken =>
            putApi(accessToken, `persons/${req.item.id}/favorite`, {
                isFavorite: req.isFavorite
            })
        );

    /*
       The whole list in one request - the API returns a few hundred at most and
       deliberately does not page it, so the picker can filter locally instead of
       spending a round trip per keystroke.
    */
    const peopleQuery = (enabled?: Accessor<boolean>) =>
        useQuery(() => ({
            queryKey: queryKeys.people.all(),
            queryFn: fetchPeople,
            enabled: (enabled?.() ?? true) && authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    /*
       Accessors, so moving to another person - or narrowing to favorites, or
       reshuffling - re-keys this one subscription rather than leaving the caller
       to build a replacement query. The filter belongs in the key because it
       changes which rows come back and in what order, so two filters must not
       share a cache entry.
    */
    const personMediaQuery = (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PersonMediaFilter>
    ) =>
        useInfiniteQuery(() => ({
            queryKey: queryKeys.people.media(id(), filter()),
            queryFn: data => fetchPersonMedia(id()!, data.pageParam, filter()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    const personCategoriesQuery = (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) =>
        useInfiniteQuery(() => ({
            queryKey: queryKeys.people.categories(id(), { favoritesOnly: favoritesOnly() }),
            queryFn: data => fetchPersonCategories(id()!, data.pageParam, favoritesOnly()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    /*
       Patched into the cached list rather than refetched - see the note in
       CategoriesContext for why reference stability matters to a grid keyed on
       object identity. The API answers with the updated person, but the only
       field that can have moved is the one just sent, so patching it in keeps
       every other card's reference untouched.

       The list is ordered favorites first, so the card visibly moves once this
       lands. That reordering is the point of the mark, and it is why this does
       not try to hold the card still.
    */
    const applyPersonIsFavorite = (id: Uuid, isFavorite: boolean) => {
        queryClient.setQueryData<Person[]>(queryKeys.people.all(), prev =>
            prev ? patchById(prev, id, { isFavorite }) : prev
        );
    };

    const setIsFavoriteMutation = useMutation(() => ({
        mutationFn: (req: IsFavoriteRequest<Person>) => postIsFavorite(req),
        onSuccess: (response, request) => {
            applyPersonIsFavorite(request.item.id, request.isFavorite);

            // the value is now on screen, so let its heart celebrate
            pulseFavorite(request.item.id);
        }
    }));

    return (
        <PeopleContext.Provider
            value={{
                peopleQuery,
                personMediaQuery,
                personCategoriesQuery,
                setIsFavoriteMutation
            }}
        >
            {props.children}
        </PeopleContext.Provider>
    );
};

export const usePeopleContext = () => {
    const ctx = useContext(PeopleContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("People context not provided by ancestor component!");
};
