import { lazy } from 'solid-js'
import { categories } from '../categories/_routes'
import { AppRouteDefinition } from '../models/AppRouteDefinition'
import { equalsIgnoreCase } from '../models/Utils'

export const categoriesPhotos: AppRouteDefinition = {
    icon: undefined as string,
    name: undefined as string,
    path: `${categories.path}/photos`,
    component: lazy(() => import('./PhotoCategories'))
}

export const categoriesPhotosGrid: AppRouteDefinition = {
    icon: "i-ic-outline-apps",
    name: "Grid View",
    path: `${categoriesPhotos.path}/grid`,
    component: lazy(() => import('./ViewGrid'))
}

export const categoriesPhotosDetail: AppRouteDefinition = {
    icon: "i-ic-round-dashboard",
    name: "Detail View",
    path: `${categoriesPhotos.path}/detail`,
    component: lazy(() => import('./ViewDetail'))
}

export const categoriesPhotosFullscreen: AppRouteDefinition = {
    icon: "i-ic-round-fullscreen",
    name: "Fullscreen View",
    path: `${categoriesPhotos.path}/fullscreen`,
    component: lazy(() => import('./ViewFullscreen'))
}

export const categoriesPhotosMap: AppRouteDefinition = {
    icon: "i-ic-round-map",
    name: "Map View",
    path: `${categoriesPhotos.path}/map`,
    component: lazy(() => import('./ViewMap'))
}

export const categoriesPhotosBulkEdit: AppRouteDefinition = {
    icon: "i-ic-round-collections",
    name: "Bulk Edit View",
    path: `${categoriesPhotos.path}/bulk-edit`,
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

export const getPathForViewMode = (mode: string): string => {
    if(equalsIgnoreCase('grid', mode)) {
        return categoriesPhotosGrid.path;
    }

    if(equalsIgnoreCase('detail', mode)) {
        return categoriesPhotosDetail.path;
    }

    if(equalsIgnoreCase('fullscreen', mode)) {
        return categoriesPhotosFullscreen.path;
    }

    if(equalsIgnoreCase('map', mode)) {
        return categoriesPhotosMap.path;
    }

    if(equalsIgnoreCase('bulkEdit', mode)) {
        return categoriesPhotosBulkEdit.path;
    }

    return categoriesPhotosGrid.path;
}
