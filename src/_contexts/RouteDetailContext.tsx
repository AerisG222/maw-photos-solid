import { useLocation } from "@solidjs/router";
import { ParentComponent, createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { Area } from "../_models/AppRouteDefinition";
import { appRoutes } from "../routes";

export interface RouteDetailState {
    readonly path?: string;
    readonly area?: Area;
}

export const defaultRouteDetailState: RouteDetailState = {
    path: undefined,
    area: undefined
};

export type RouteDetailContextValue = [state: RouteDetailState, actions: {}];

const RouteDetailContext = createContext<RouteDetailContextValue>();

export const RouteDetailProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultRouteDetailState);
    const location = useLocation();

    const getActiveArea = (path: string): Area | undefined => {
        let routeArea = undefined;

        for (const route of appRoutes) {
            if (route.doesPathMatch) {
                const [matches, area] = route.doesPathMatch(path);

                if (matches) {
                    routeArea = area;
                    break;
                }
            }
        }

        return routeArea;
    };

    createEffect(() => {
        const area = getActiveArea(location.pathname);

        setState({
            path: location.pathname,
            area: area
        });
    });

    return (
        <RouteDetailContext.Provider value={[state, {}]}>
            {props.children}
        </RouteDetailContext.Provider>
    );
};

export const useRouteDetailContext = () => {
    const ctx = useContext(RouteDetailContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("RouteDetail context not provided by ancestor component!");
};
