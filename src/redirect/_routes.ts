import { lazy } from 'solid-js'
import { AppRouteDefinition } from '../_models/AppRouteDefinition'

export const catchAllRedirect: AppRouteDefinition = {
    path: "*",
    component: lazy(() => import('./Redirect'))
};
