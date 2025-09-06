import { createContext, ParentComponent, Show, useContext } from "solid-js";
import { useQuery, UseQueryResult } from "@tanstack/solid-query";

import { Scale } from "../../_models/Scale";
import { useAuthContext } from "../AuthContext";
import { ThumbnailSize } from "../../_models/ThumbnailSize";
import { useWindowSizeContext } from "../WindowSizeContext";
import { queryApi, runWithAccessToken } from "./_shared";
import Loading from "../../_components/loading/Loading";

export interface ConfigService {
    scalesQuery: () => UseQueryResult<Scale[], Error>;
    getScalesForThumbnail: (thumbSize: ThumbnailSize) => Scale[];
    getScalesForMain: (width: number, height: number) => Scale[];
}

const ConfigContext = createContext<ConfigService>();

export const ConfigProvider: ParentComponent = props => {
    const [authContext, { getToken }] = useAuthContext();
    const [windowSizeContext] = useWindowSizeContext();

    const fetchScales = async () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Scale[]>(accessToken, "config/scales")
        );

    const scalesQuery = () =>
        useQuery(() => ({
            queryKey: ["config", "scales"],
            queryFn: fetchScales,
            enabled: authContext.isLoggedIn,
            staleTime: 15 * 60 * 1000
        }));

    const sortScalesDescendingInSize = (a: Scale, b: Scale) => a.width - b.width;

    const getScalesForThumbnail = (thumbSize: ThumbnailSize) =>
        scalesQuery()
            ?.data?.filter(s => s.fillsDimensions && s.width >= thumbSize.width)
            ?.sort(sortScalesDescendingInSize) ?? [];

    const getScalesForMain = () =>
        scalesQuery()
            ?.data?.filter(
                s =>
                    !s.fillsDimensions &&
                    s.width >= windowSizeContext.width &&
                    s.height >= windowSizeContext.height
            )
            ?.sort(sortScalesDescendingInSize) ?? [];

    return (
        <ConfigContext.Provider value={{ scalesQuery, getScalesForThumbnail, getScalesForMain }}>
            <Show when={scalesQuery().isSuccess} fallback={<Loading />}>
                {props.children}
            </Show>
        </ConfigContext.Provider>
    );
};

export const useConfigContext = () => {
    const ctx = useContext(ConfigContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Config context not provided by ancestor component!");
};
