import { lazy } from 'solid-js'
import { categories } from '../categories/_routes'
import { AppRouteDefinition } from '../models/AppRouteDefinition'

export const categoriesPhotos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: `${categories.path}/photos`,
    component: lazy(() => import('./PhotoCategories'))
}

export const categoriesPhotosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${categoriesPhotos}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const categoriesPhotosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${categoriesPhotos}/detail`,
    component: lazy(() => import('./ViewDetail'))
}

export const categoriesPhotosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${categoriesPhotos}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
}

export const categoriesPhotosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    path: `${categoriesPhotos}/map`,
    component: lazy(() => import('./ViewMap'))
}

export const categoriesPhotosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    path: `${categoriesPhotos}/bulk-edit`,
    component: lazy(() => import('./ViewBulkEdit'))
}

export const categoriesPhotosRoutes = [
    categoriesPhotos,
    categoriesPhotosGrid,
    categoriesPhotosDetail,
    categoriesPhotosFullscreen,
    categoriesPhotosMap,
    categoriesPhotosBulkEdit
];
