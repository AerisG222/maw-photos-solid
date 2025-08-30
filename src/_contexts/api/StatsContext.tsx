import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { useQuery, UseQueryResult } from "@tanstack/solid-query";

import { useAuthContext } from "../AuthContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { YearStat } from "../../_models/YearStat";
import { CategoryStat } from "../../_models/CategoryStat";

// todo: these names kinda suck
export type StatsService = {
    statsByYearQuery: () => UseQueryResult<YearStat[], Error>;
    statsForYearQuery: (year: Accessor<number>) => UseQueryResult<CategoryStat[], Error>;
};

const StatsContext = createContext<StatsService>();

export const StatsProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const fetchStatsByYear = async () =>
        runWithAccessToken(getToken, accessToken => queryApi<YearStat[]>(accessToken, "stats"));

    const fetchStatsForYear = async (year: number) =>
        year
            ? runWithAccessToken(getToken, accessToken =>
                  queryApi<CategoryStat[]>(accessToken, `stats/${year}`)
              )
            : [];

    const statsByYearQuery = () =>
        useQuery(() => ({
            queryKey: ["stats"],
            queryFn: fetchStatsByYear,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const statsForYearQuery = (year: Accessor<number>) =>
        useQuery(() => ({
            queryKey: ["stats", year()],
            queryFn: () => fetchStatsForYear(year()),
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    return (
        <StatsContext.Provider value={{ statsByYearQuery, statsForYearQuery }}>
            {props.children}
        </StatsContext.Provider>
    );
};

export const useStatsContext = () => {
    const ctx = useContext(StatsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Stats context not provided by ancestor component!");
};
