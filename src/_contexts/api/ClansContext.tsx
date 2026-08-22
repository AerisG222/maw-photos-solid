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

    /*
       Invalidated rather than patched, unlike the favorite toggles elsewhere.
       There are only ever a handful of clans, the server decides where a new or
       renamed one sorts, and a membership change rewrites a list of whole people
       - so there is no small, well understood field to write in place, and a
       refetch is both simpler and certainly correct.
    */
    const invalidateClans = async () => {
        await queryClient.invalidateQueries({ queryKey: ["clans"], refetchType: "all" });
    };

    const createClanMutation = useMutation(() => ({
        mutationFn: (req: CreateClanRequest) => postClan(req),
        onSuccess: invalidateClans
    }));

    const renameClanMutation = useMutation(() => ({
        mutationFn: (req: RenameClanRequest) => putClan(req),
        onSuccess: invalidateClans
    }));

    const setClanPersonsMutation = useMutation(() => ({
        mutationFn: (req: SetClanPersonsRequest) => putClanPersons(req),
        onSuccess: invalidateClans
    }));

    const deleteClanMutation = useMutation(() => ({
        mutationFn: (id: Uuid) => removeClan(id),
        onSuccess: invalidateClans
    }));

    return (
        <ClansContext.Provider
            value={{
                clansQuery,
                clanMediaQuery,
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
