import { loginRoutes } from './auth/_routes';
import { categoriesRoutes } from './categories/_routes';
import { aboutRoutes } from './about/_routes';
import { categoriesPhotosRoutes } from './categories-photos/_routes';
import { categoriesVideosRoutes } from './categories-videos/_routes';
import { randomRoutes } from './random/_routes';
import { searchRoutes } from './search/_routes';
import { statsRoutes } from './stats/_routes';
import { settingsRoutes } from './settings/_routes';
import { redirectRoutes } from './redirect/_routes';
import { AppRouteDefinition } from './models/AppRouteDefinition';

export const appRoutes = [
    ...loginRoutes,
    ...categoriesRoutes,
    ...categoriesPhotosRoutes,
    ...categoriesVideosRoutes,
    ...searchRoutes,
    ...randomRoutes,
    ...statsRoutes,
    ...aboutRoutes,
    ...settingsRoutes,
    ...redirectRoutes
];

const getAllIcons = (routes: AppRouteDefinition[]) => {
    const icons = [];

    for(const route of routes) {
        getIcons(route, icons);
    }

    return icons;
}

const getIcons = (route: AppRouteDefinition, icons: string[]) => {
    if(route.children) {
        for(const childRoute of route.children) {
            getIcons(childRoute, icons);
        }
    }

    if(route.icon) {
        icons.push(route.icon);
    }

    return icons;
}

export const allRouteIcons = new Set(getAllIcons(appRoutes));
