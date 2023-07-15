import { lazy } from 'solid-js';
import { AppRouteDefinition } from '../_models/AppRouteDefinition';

const basePath = "/login";

export const loginPage: AppRouteDefinition = {
    path: '/',
    absolutePath: basePath,
    component: lazy(() => import('./Login'))
};

export const handleResponse: AppRouteDefinition = {
    path: '/handle-response',
    absolutePath: `${basePath}/handle-response`,
    component: lazy(() => import('./HandleResponse'))
};

export const login: AppRouteDefinition = {
    path: basePath,
    absolutePath: basePath,
    children: [
        loginPage,
        handleResponse
    ]
};
