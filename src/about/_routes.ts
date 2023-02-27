import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';

export const about: AppRouteDefinition = {
    icon: "i-ic-round-help-outline",
    name: "About",
    path: "/about",
    component: lazy(() => import('./About'))
}

export const aboutRoutes = [
    about
];
