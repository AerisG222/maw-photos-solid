import { AppRouteDefinition } from "../AppRouteDefinition";

// a repeated query string key parses as an array; the last value wins, matching
// how the browser would have filled the control that wrote it
export const firstParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[value.length - 1] : value;

type RouteParamValues = Record<string, string | number | undefined>;

const buildRootPath = (route: AppRouteDefinition, routeParams?: RouteParamValues) => {
    if (!routeParams) {
        return route.absolutePath;
    }

    let path = route.absolutePath;

    // apply provided replacements
    for (const [key, value] of Object.entries(routeParams)) {
        if (value) {
            path = path.replace(new RegExp(`:${key}\\??`), String(value));
        }
    }

    // remove params that may remain [this will remove all interior params]
    path = path.replaceAll(/:.*?\//g, "");

    // remove params that may remain at the end of the path
    path = path.replaceAll(/:.*\??/g, "");

    // do not end w/ trailing slash
    if (path.endsWith("/")) {
        path = path.slice(0, -1);
    }

    return path;
};

const buildSearch = (routeSearch?: RouteParamValues) => {
    let search = "";

    if (!routeSearch) {
        return search;
    }

    let isFirst = true;

    for (const [key, value] of Object.entries(routeSearch)) {
        search += isFirst ? "?" : "&";
        search += `${key}=${String(value)}`;
        isFirst = false;
    }

    return search;
};

export const buildPath = (
    route: AppRouteDefinition,
    routeParams?: RouteParamValues,
    routeSearch?: RouteParamValues
) => {
    let path = buildRootPath(route, routeParams);

    path += buildSearch(routeSearch);

    return path;
};
