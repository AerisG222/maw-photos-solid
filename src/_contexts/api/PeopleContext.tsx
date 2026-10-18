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
import {
    PersonMediaFilter,
    peopleQueryOptions,
    personCategoriesQueryOptions,
    personMediaQueryOptions
} from "./_peopleQueries";
import { putApi, runWithAccessToken } from "./_shared";
import { patchById } from "./_cacheUtils";
import { pulseFavorite } from "../../_components/icon/_favoritePulse";
import { IsFavoriteRequest } from "../../_models/IsFavoriteRequest";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   How a person's feed is narrowed and ordered.

export type { PersonMediaFilter } from "./_peopleQueries";

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
            ...peopleQueryOptions(getToken),
            enabled: (enabled?.() ?? true) && authContext.isLoggedIn
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
            ...personMediaQueryOptions(getToken, id()!, filter()),
            enabled: !!id() && authContext.isLoggedIn
        }));

    const personCategoriesQuery = (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) =>
        useInfiniteQuery(() => ({
            ...personCategoriesQueryOptions(getToken, id()!, favoritesOnly()),
            enabled: !!id() && authContext.isLoggedIn
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
