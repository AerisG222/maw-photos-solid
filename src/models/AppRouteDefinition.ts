import { RouteDefinition } from '@solidjs/router'

export type AppRouteDefinition =
    RouteDefinition & {
        icon?: string;
        name?: string;
        absolutePath?: string;
        helpText?: string;
    };

export const buildPath = (route: AppRouteDefinition, routeParams?: any) => {
    // todo: update all other routes to include absolute path if this works
    if(!route.absolutePath) { return route.path; }

    if(!routeParams) {
        return route.absolutePath;
    }

    let path = route.absolutePath;

    // apply provided replacements
    for(let [key, value] of Object.entries(routeParams)) {
        path = path.replace(`:${key}`, value);
    }

    // remove optional params that may remain
    path = path.replace(/:(.*)\?/, '');

    // do not end w/ trailing slash
    if(path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    return path;
}
