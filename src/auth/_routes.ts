import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../models/AppRouteDefinition';

export const login: AppRouteDefinition = {
    icon: undefined,
    name: undefined,
    path: "/login",
    component: lazy(() => import('./Login'))
}

export const handleResponse: AppRouteDefinition = {
    icon: undefined,
    name: undefined,
    path: `${login.path}/handle-response`,
    component: lazy(() => import('./HandleResponse'))
}

export const loginRoutes = [
    login,
    handleResponse
];
