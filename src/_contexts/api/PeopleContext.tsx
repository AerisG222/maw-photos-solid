import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import {
    InfiniteData,
    useInfiniteQuery,
    UseInfiniteQueryResult,
    useQuery,
    UseQueryResult
} from "@tanstack/solid-query";

import { useAuthContext } from "../AuthContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { SearchResults } from "../../_models/SearchResults";
import { Uuid } from "../../_models/Uuid";

/*
   People, as detected by the face recognition pipeline.

   The API calls the resource "persons"; the app says "people" everywhere the
   user can see, so the naming splits at this boundary and nowhere else.
*/
export interface PeopleService {
    peopleQuery: () => UseQueryResult<Person[], Error>;
    personMediaQuery: (
        id: Accessor<Uuid | undefined>
    ) => UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;
}

const PeopleContext = createContext<PeopleService>();

export const PeopleProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const fetchPeople = async () =>
        runWithAccessToken(getToken, accessToken => queryApi<Person[]>(accessToken, "persons"));

    const fetchPersonMedia = async (id: Uuid, offset: number) =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<SearchResults<Media>>(accessToken, `persons/${id}/media`, {
                o: offset.toString()
            })
        );

    /*
       The whole list in one request - the API returns a few hundred at most and
       deliberately does not page it, so the picker can filter locally instead of
       spending a round trip per keystroke.
    */
    const peopleQuery = () =>
        useQuery(() => ({
            queryKey: ["people"],
            queryFn: fetchPeople,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    // accessor, so moving to another person re-keys this one subscription
    // rather than leaving the caller to build a replacement query
    const personMediaQuery = (id: Accessor<Uuid | undefined>) =>
        useInfiniteQuery(() => ({
            queryKey: ["people", id(), "media"],
            queryFn: data => fetchPersonMedia(id()!, data.pageParam),
            enabled: !!id() && authContext.isLoggedIn,
            staleTime: 5 * 60 * 1000,
            initialPageParam: 0,
            getNextPageParam: (lastPage, _pages) =>
                lastPage?.hasMoreResults ? lastPage.nextOffset : undefined
        }));

    return (
        <PeopleContext.Provider value={{ peopleQuery, personMediaQuery }}>
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
