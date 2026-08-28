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
import { deleteApi, postApi, putApi, queryApi, runWithAccessToken } from "./_shared";
import { Category, CategoryDto, mapCategory } from "../../_models/Category";
import { Clan, ClanDto, mapClan } from "../../_models/Clan";
import { Media } from "../../_models/Media";
import { PersonMediaFilter } from "./PeopleContext";
import { SearchResults } from "../../_models/SearchResults";
import {
    CreateClanRequest,
    RenameClanRequest,
    SetClanPersonsRequest
} from "../../_models/ClanRequest";
import { Uuid } from "../../_models/Uuid";

export interface ClansService {
    clansQuery: () => UseQueryResult<Clan[], Error>;
    clanMediaQuery: (
        id: Accessor<Uuid | undefined>,
        filter: Accessor<PersonMediaFilter>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;
    clanCategoriesQuery: (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Category> | undefined>, Error>;
    createClanMutation: UseMutationResult<Clan, Error, CreateClanRequest, unknown>;
    renameClanMutation: UseMutationResult<Clan, Error, RenameClanRequest, unknown>;
    setClanPersonsMutation: UseMutationResult<Clan, Error, SetClanPersonsRequest, unknown>;
    deleteClanMutation: UseMutationResult<Response, Error, Uuid, unknown>;
}

const ClansContext = createContext<ClansService>();

export const ClansProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const queryClient = useQueryClient();

    const fetchClans = async () =>
        runWithAccessToken(getToken, async accessToken => {
            const clans = await queryApi<ClanDto[]>(accessToken, "clans");

            return clans.map(mapClan);
        });

    // create, rename and membership all answer with the clan as it now stands,
    // so each returns it rather than making the caller re-read the list
    const readClan = async (response: Response) => mapClan((await response.json()) as ClanDto);

    const postClan = async (req: CreateClanRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readClan(
                await postApi(accessToken, "clans", {
                    name: req.name,
                    personIds: req.personIds
                })
            )
        );

    /*
       Membership is deliberately omitted on a rename. The API reads a missing
       list as "leave it alone", so a rename cannot race an edit made elsewhere
       into emptying the clan.
    */
    const putClan = async (req: RenameClanRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readClan(await putApi(accessToken, `clans/${req.id}`, { name: req.name }))
        );

    const putClanPersons = async (req: SetClanPersonsRequest) =>
        runWithAccessToken(getToken, async accessToken =>
            readClan(
                await putApi(accessToken, `clans/${req.id}/persons`, { personIds: req.personIds })
            )
        );

    /*
       Identical in shape to the person feed, because it is the same feed - a
       clan matches media holding any of its members, and a photo with three of
       them still counts once.
    */
    const fetchClanMedia = async (id: Uuid, offset: number, filter: PersonMediaFilter) => {
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
    const fetchClanCategories = async (id: Uuid, offset: number, favoritesOnly: boolean) => {
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

    const removeClan = async (id: Uuid) =>
        runWithAccessToken(getToken, accessToken => deleteApi(accessToken, `clans/${id}`));

    const clansQuery = () =>
        useQuery(() => ({
            queryKey: ["clans"],
            queryFn: fetchClans,
            enabled: authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000
        }));

    const clanMediaQuery = (id: Accessor<Uuid | undefined>, filter: Accessor<PersonMediaFilter>) =>
        useInfiniteQuery(() => ({
            queryKey: ["clans", id(), "media", filter()],
            queryFn: data => fetchClanMedia(id()!, data.pageParam, filter()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    const clanCategoriesQuery = (
        id: Accessor<Uuid | undefined>,
        favoritesOnly: Accessor<boolean>
    ) =>
        useInfiniteQuery(() => ({
            queryKey: ["clans", id(), "categories", { favoritesOnly: favoritesOnly() }],
            queryFn: data => fetchClanCategories(id()!, data.pageParam, favoritesOnly()),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    /*
       Every write answers with the clan as it now stands, so the list is updated
       from that answer rather than refetched.

       This used to invalidate and await the refetch. An `onSuccess` that returns
       a promise holds the mutation open until it resolves, so a save that had
       already succeeded still sat there for a second round trip before the
       dialog would close - the work was done, the screen just had not been told.

       The API orders clans by name, so the same rule is applied here and a
       renamed clan lands where a refetch would have put it. Postgres and
       `localeCompare` can disagree on the exotic edges of that ordering; the
       next natural refetch settles any such difference.
    */
    const upsertClan = (clan: Clan) => {
        queryClient.setQueryData<Clan[]>(["clans"], prev =>
            prev
                ? [...prev.filter(existing => existing.id !== clan.id), clan].sort((a, b) =>
                      a.name.localeCompare(b.name)
                  )
                : // nothing cached yet means the list is still on its way, and it
                  // will arrive holding this clan already
                  prev
        );
    };

    const dropClan = (id: Uuid) => {
        queryClient.setQueryData<Clan[]>(["clans"], prev =>
            prev?.filter(existing => existing.id !== id)
        );
    };

    const createClanMutation = useMutation(() => ({
        mutationFn: (req: CreateClanRequest) => postClan(req),
        onSuccess: upsertClan
    }));

    const renameClanMutation = useMutation(() => ({
        mutationFn: (req: RenameClanRequest) => putClan(req),
        onSuccess: upsertClan
    }));

    const setClanPersonsMutation = useMutation(() => ({
        mutationFn: (req: SetClanPersonsRequest) => putClanPersons(req),
        onSuccess: upsertClan
    }));

    const deleteClanMutation = useMutation(() => ({
        mutationFn: (id: Uuid) => removeClan(id),
        onSuccess: (_response, id) => dropClan(id)
    }));

    return (
        <ClansContext.Provider
            value={{
                clansQuery,
                clanMediaQuery,
                clanCategoriesQuery,
                createClanMutation,
                renameClanMutation,
                setClanPersonsMutation,
                deleteClanMutation
            }}
        >
            {props.children}
        </ClansContext.Provider>
    );
};

export const useClansContext = () => {
    const ctx = useContext(ClansContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Clans context not provided by ancestor component!");
};
