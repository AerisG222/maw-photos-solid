import { AppRouteDefinition } from './AppRouteDefinition';

const buildRootPath = (route: AppRouteDefinition, routeParams?: any) => {
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
}

export const buildPath = (route: AppRouteDefinition, routeParams?: any, routeSearch?: any) => {
    // todo: update all other routes to include absolute path if this works
    if(!route.absolutePath) { return route.path; }

    let path = buildRootPath(route, routeParams);

    path += buildSearch(routeSearch);

    return path;
}
