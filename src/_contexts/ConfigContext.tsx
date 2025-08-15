import { createContext, createResource, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { Scale } from "../_models/Scale";
import { useAuthContext } from "./AuthContext";
import { getScales } from "../_api/Config";
import { ThumbnailSize } from "../_models/ThumbnailSize";
import { useWindowSizeContext } from "./WindowSizeContext";

export type ConfigState = {
    readonly scales: Scale[];
};

export const defaultConfigState: ConfigState = {
    scales: []
};

export type ConfigContextValue = [
    state: ConfigState,
    actions: {
        setScales: (scales: Scale[]) => void;
        getScalesForThumbnail: (thumbSize: ThumbnailSize) => Scale[];
        getScalesForMain: (width: number, height: number) => Scale[];
    }
];

const ConfigContext = createContext<ConfigContextValue>();

export const ConfigProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultConfigState);
    const [authContext, { getToken }] = useAuthContext();
    const [windowSizeContext] = useWindowSizeContext();
    const setScales = (scales: Scale[]) => setState({ scales });

    createResource(authContext.isLoggedIn, async isLoggedIn => {
        if (isLoggedIn) {
            var accessToken = await getToken();

            if (accessToken) {
                var scales = await getScales(accessToken);
                setScales(scales);
            }
        }
    });

    const sortScalesDescendingInSize = (a: Scale, b: Scale) => a.width - b.width;

    const getScalesForThumbnail = (thumbSize: ThumbnailSize) =>
        state.scales
            .filter(s => s.fillsDimensions && s.width >= thumbSize.width)
            .sort(sortScalesDescendingInSize);

    const getScalesForMain = () =>
        state.scales
            .filter(
                s =>
                    !s.fillsDimensions &&
                    s.width >= windowSizeContext.width &&
                    s.height >= windowSizeContext.height
            )
            .sort(sortScalesDescendingInSize);

    return (
        <ConfigContext.Provider
            value={[state, { setScales, getScalesForThumbnail, getScalesForMain }]}
        >
            {props.children}
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
