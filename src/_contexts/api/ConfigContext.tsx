import { createContext, createEffect, Match, ParentComponent, Switch, useContext } from "solid-js";
import { useQuery, UseQueryResult } from "@tanstack/solid-query";

import { Scale } from "../../_models/Scale";
import { useAuthContext } from "../AuthContext";
import { queryKeys } from "./_queryKeys";
import { ThumbnailSize } from "../../_models/ThumbnailSize";
import { useWindowSizeContext } from "../WindowSizeContext";
import { queryApi, runWithAccessToken } from "./_shared";
import { AccountStatus } from "../../_models/AccountStatus";

import Loading from "../../_components/loading/Loading";
import ErrorMessage from "../../_components/error/ErrorMessage";

export interface ConfigService {
    scalesQuery: () => UseQueryResult<Scale[], Error>;
    getScalesForThumbnail: (thumbSize: ThumbnailSize) => Scale[];
    getScalesForMain: () => Scale[];
}

const ConfigContext = createContext<ConfigService>();

export const ConfigProvider: ParentComponent = props => {
    const [authContext, { getToken, setAccountStatus }] = useAuthContext();
    const [windowSizeContext] = useWindowSizeContext();

    const fetchScales = async () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<Scale[]>(accessToken, "config/scales")
        );

    const fetchAccountStatus = async () =>
        runWithAccessToken(getToken, accessToken =>
            queryApi<AccountStatus>(accessToken, "auth/account-status")
        );

    /*
       Created once, here in the provider body. These used to be factories that
       ran `useQuery` on every call, and `getScalesForMain` calls back into them
       from render - so each photo navigation spun up another observer, and no
       caller could reliably read the shared loading/error state.
    */
    const scales = useQuery(() => ({
        queryKey: queryKeys.config.scales(),
        queryFn: fetchScales,
        enabled: authContext.isLoggedIn,
        staleTime: 15 * 60 * 1000
    }));

    const accountStatus = useQuery(() => ({
        queryKey: queryKeys.auth.accountStatus(),
        queryFn: fetchAccountStatus,
        enabled: authContext.isLoggedIn,
        staleTime: 5 * 60 * 1000
    }));

    // keeps the existing ConfigService shape while handing back the one instance
    const scalesQuery = () => scales;

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

    // publishing account status is a side effect, so it belongs in an effect -
    // it previously ran inside the <Show> predicate below, which is a tracked
    // computation and no place to be writing state
    createEffect(() => {
        if (accountStatus.isSuccess && accountStatus.data) {
            setAccountStatus(accountStatus.data);
        }
    });

    /*
       Boot gate. Previously this was a single boolean, so "still loading" and
       "failed" were indistinguishable: if either query errored the app sat on a
       spinner forever with no message and no way out short of a manual reload.
    */
    const bootState = () => {
        if (!authContext.isLoggedIn) {
            // allow request to proceed so they can see the login page
            return "ready";
        }

        if (scales.isError || accountStatus.isError) {
            return "error";
        }

        return scales.isSuccess && accountStatus.isSuccess ? "ready" : "loading";
    };

    const retryBoot = () => {
        void scales.refetch();
        void accountStatus.refetch();
    };

    return (
        <ConfigContext.Provider value={{ scalesQuery, getScalesForThumbnail, getScalesForMain }}>
            <Switch fallback={<Loading />}>
                <Match when={bootState() === "ready"}>{props.children}</Match>
                <Match when={bootState() === "error"}>
                    <ErrorMessage
                        title="MaW Photos could not finish loading"
                        error={scales.error ?? accountStatus.error}
                        onRetry={retryBoot}
                    />
                </Match>
            </Switch>
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
