import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const catchAllRedirect: AppRouteDefinition = {
    path: "*",
    component: lazy(() => import('./Redirect'))
};
