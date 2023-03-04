import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const catchAllRedirect: AppRouteDefinition = {
    icon: undefined,
    name: undefined,
    path: "*",
    component: lazy(() => import('./Redirect'))
}

export const redirectRoutes = [
    catchAllRedirect
];
