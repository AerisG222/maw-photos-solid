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
    getScalesForMain: () => Scale[];
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

    const sortScalesDescendingInSize = (a: Scale, b: Scale) => b.width - a.width;

    const getScalesForThumbnail = (thumbSize: ThumbnailSize) =>
        scalesQuery()
            ?.data?.filter(s => s.fillsDimensions && s.width >= thumbSize.width)
            ?.sort(sortScalesDescendingInSize) ?? [];

    const shouldIncludePriorScale = (currScale: Scale) => {
        const threshold = 0.2;
        const heightDiffPct = windowSizeContext.height / currScale.height;
        const widthDiffPct = windowSizeContext.width / currScale.width;

        return heightDiffPct > threshold && widthDiffPct > threshold;
    };

    const getScalesForMain = () => {
        const results: Scale[] = [];
        let priorScale: Scale | undefined;
        const scales = scalesQuery()?.data;

        if (scales) {
            for (const scale of scales) {
                if (scale.fillsDimensions || scale.code === "src") {
                    continue;
                }

                if (
                    scale.height > windowSizeContext.height &&
                    scale.width > windowSizeContext.width
                ) {
                    priorScale = scale;
                    continue;
                }

                if (priorScale && shouldIncludePriorScale(scale)) {
                    results.push(priorScale);
                    priorScale = undefined;
                }

                results.push(scale);
            }
        }

        return results;
    };

    return (
        <ConfigContext.Provider value={{ scalesQuery, getScalesForThumbnail, getScalesForMain }}>
            <Show when={!authContext.isLoggedIn || scalesQuery().isSuccess} fallback={<Loading />}>
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
