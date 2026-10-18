import { queryOptions } from "@tanstack/solid-query";

import { queryApi, runWithAccessToken } from "./_shared";
import { queryKeys } from "./_queryKeys";
import { GetToken } from "./_configQueries";
import { YearStat } from "../../_models/YearStat";
import { CategoryStat } from "../../_models/CategoryStat";

/*
   The query definitions for statistics: key, fetch and freshness together, shared
   by the context that screens read through and by the route loaders that start
   the same queries before a screen exists. One definition, so a loader warms
   exactly the cache entry the screen then reads, and trusts it for exactly as
   long.
*/

export const fetchStatsByYear = async (getToken: GetToken) =>
    runWithAccessToken(getToken, accessToken => queryApi<YearStat[]>(accessToken, "stats"));

export const fetchStatsForYear = async (getToken: GetToken, year: number) =>
    runWithAccessToken(getToken, accessToken =>
        queryApi<CategoryStat[]>(accessToken, `stats/${year}`)
    );

export const statsByYearQueryOptions = (getToken: GetToken) =>
    queryOptions({
        queryKey: queryKeys.stats.all(),
        queryFn: () => fetchStatsByYear(getToken),
        staleTime: 15 * 60 * 1000
    });

export const statsForYearQueryOptions = (getToken: GetToken, year: number) =>
    queryOptions({
        queryKey: queryKeys.stats.year(year),
        queryFn: () => fetchStatsForYear(getToken, year),
        staleTime: 15 * 60 * 1000
    });
