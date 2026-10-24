import { Accessor, createContext, ParentComponent, useContext } from "solid-js";
import { UseQueryResult } from "@tanstack/solid-query";
import { useQuery } from "./_queries";

import { useAuthContext } from "../AuthContext";
import { statsByYearQueryOptions, statsForYearQueryOptions } from "./_statsQueries";
import { YearStat } from "../../_models/YearStat";
import { CategoryStat } from "../../_models/CategoryStat";

// todo: these names kinda suck
export interface StatsService {
    statsByYearQuery: () => UseQueryResult<YearStat[], Error>;
    statsForYearQuery: (year: Accessor<number>) => UseQueryResult<CategoryStat[], Error>;
}

const StatsContext = createContext<StatsService>();

export const StatsProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();

    const statsByYearQuery = () =>
        useQuery(() => ({
            ...statsByYearQueryOptions(getToken),
            enabled: authContext.isLoggedIn
        }));

    const statsForYearQuery = (year: Accessor<number>) =>
        useQuery(() => ({
            ...statsForYearQueryOptions(getToken, year()),
            enabled: year() > 0 && authContext.isLoggedIn
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
