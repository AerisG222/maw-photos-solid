import { queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { AccountStatus } from "../../_models/AccountStatus";
import { Scale } from "../../_models/Scale";

export type GetToken = () => Promise<string | undefined>;

/*
   The query definitions for the application's configuration and the caller's account: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchScales = async (getToken: GetToken) =>
    runWithAccessToken(getToken, accessToken => queryApi<Scale[]>(accessToken, "config/scales"));

export const scalesQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.config.scales(),
        queryFn: () => fetchScales(getToken),
        staleTime: 15 * 60 * 1000
    });

export const accountStatusQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.auth.accountStatus(),
        queryFn: () =>
            runWithAccessToken(getToken, accessToken =>
                queryApi<AccountStatus>(accessToken, "auth/account-status")
            ),
        staleTime: 5 * 60 * 1000
    });
