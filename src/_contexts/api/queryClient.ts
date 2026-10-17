import { QueryClient } from "@tanstack/solid-query";

import { ApiError } from "./ApiError";

/*
   Made once, above the router rather than inside the screens it serves, so that
   a route's loader can warm the same cache the screen then reads.
*/
export const createAppQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                /*
                   The default is three blind retries with backoff, so a 401 or
                   404 made the user wait through several pointless round trips
                   before anything could be shown. A 4xx reflects the request
                   itself and will not resolve on its own - surface it at once,
                   and keep retrying only the transient cases.
                */
                retry: (failureCount, error) =>
                    error instanceof ApiError && error.isClientError ? false : failureCount < 2,

                /*
                   The default is zero, which means every query refetches the
                   moment a component mounts - so stepping from a grid to the
                   map and back fetched the whole category twice more, for data
                   that had not moved.

                   Safe because nothing here relies on that refetch to stay
                   correct: every mutation invalidates or writes through on
                   success, so a favorite, a rename or a new cover updates the
                   cache directly. This only decides how long an untouched
                   answer is trusted between visits.

                   A minute is conservative. The listings behind it change when
                   somebody uploads, which is out of band and rare; the figure
                   could be raised a long way before anybody noticed, and the
                   queries that want something different already say so.
                */
                staleTime: 60 * 1000
            },
            // a write should never be replayed automatically
            mutations: { retry: false }
        }
    });
