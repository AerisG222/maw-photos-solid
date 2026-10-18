import { infiniteQueryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { Media } from "../../_models/Media";

/*
   The query definitions for media: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchRandom = async (getToken: GetToken, count: number) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<Media[]>(accessToken, `media/random/${count}`)
    );

/*
   An unending stack: every page is a fresh random draw, so a page is never
   stale - re-fetching one would reshuffle what is already on screen.
*/
export const randomMediaQueryOptions = (getToken: GetToken, count: number) =>
    infiniteQueryOptions({
        queryKey: queryKeys.media.random(),
        queryFn: () => fetchRandom(getToken, count),
        staleTime: Infinity,
        initialPageParam: 0,
        getNextPageParam: (_lastPage: Media[] | undefined, pages: unknown[]) => pages.length,
        maxPages: 120
    });
