import { AppRouteDefinition, Area, RouteMatch } from '../AppRouteDefinition';

// todo: figure out a better way
const buildRootPath = (route: AppRouteDefinition, routeParams?: any) => {
    if(!routeParams) {
        return route.absolutePath;
    }

    let path = route.absolutePath;

    // apply provided replacements
    for(let [key, value] of Object.entries(routeParams)) {
        if(value) {
            path = path.replace(new RegExp(`:${key}\\??`), value);
        }
    }

    // remove params that may remain [this will remove all interior params]
    path = path.replaceAll(/:.*?\//g, '');

    // remove params that may remain at the end of the path
    path = path.replaceAll(/:.*\??/g, '');

    // do not end w/ trailing slash
    if(path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    return path;
};

const buildSearch = (routeSearch?: any) => {
    let search = '';

    if(!routeSearch) {
        return search;
    }

    let isFirst = true;

    for(let [key, value] of Object.entries(routeSearch)) {
        search += isFirst ? '?' : '&'
        search += `${key}=${value}`;
        isFirst = false;
    }

    return search;
};

export const buildPath = (route: AppRouteDefinition, routeParams?: any, routeSearch?: any) => {
    // todo: update all other routes to include absolute path if this works
    if(!route.absolutePath) { return route.path; }

    let path = buildRootPath(route, routeParams);

    path += buildSearch(routeSearch);

    return path;
};

export const routeMatch = (locationPath: string, baseRoutePath: string, areaWhenMatched: Area): RouteMatch => {
    if(locationPath.startsWith(baseRoutePath)) {
        return [true, areaWhenMatched];
    }

    return [false, undefined];
}
