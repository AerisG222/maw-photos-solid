import { createContext, createResource, ParentComponent, Suspense, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { Scale } from "../_models/Scale";
import { useAuthContext } from "./AuthContext";
import { getScales } from "../_api/Config";

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
    }
];

const ConfigContext = createContext<ConfigContextValue>();

export const ConfigProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultConfigState);
    const [authContext, { getToken }] = useAuthContext();
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

    return (
        <ConfigContext.Provider value={[state, { setScales }]}>
            {props.children}
        </ConfigContext.Provider>
    );
};

export const useConfigContext = () => useContext(ConfigContext);
