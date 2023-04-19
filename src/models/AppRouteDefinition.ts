import { RouteDefinition } from '@solidjs/router'

export type AppRouteDefinition =
    RouteDefinition & {
        icon?: string;
        name?: string;
        path?: string;
    };

export const buildPath = (route: AppRouteDefinition, routeParams?: any) => {
    if(!routeParams) {
        return route.path;
    }

    let path = route.path;

    for(let [key, value] of Object.entries(routeParams)) {
        path = path.replace(`:${key}`, value);
    }

    return path;
}
