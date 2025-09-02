import { AppRouteDefinition } from '../../_models/AppRouteDefinition';
import { buildPath } from '../../_models/utils/RouteUtils';
import { mediaRoutes, bulkEditRoute, detailRoute, fullscreenRoute, gridRoute, mapRoute } from '../../category/_routes';
import { MediaView, MediaViewModeBulkEdit, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid, MediaViewModeMap } from './MediaView';

// todo: move to service
export const getMediaCategoryPath = (categoryId: Uuid): string =>
    buildPath(mediaRoutes, { categoryId });

export const getMediaPathByView = (viewMode: MediaView, categoryId: Uuid, id?: Uuid): string =>
    getMediaPath(getRouteForViewMode(viewMode), categoryId, id);

export const getMediaPath = (route: AppRouteDefinition, categoryId: Uuid, id?: Uuid): string =>
    buildPath(route, { categoryId, id });

const getRouteForViewMode = (mode: MediaView): AppRouteDefinition => {
    switch (mode) {
        case MediaViewModeBulkEdit:
            return bulkEditRoute;
        case MediaViewModeDetail:
            return detailRoute;
        case MediaViewModeFullscreen:
            return fullscreenRoute;
        case MediaViewModeGrid:
            return gridRoute;
        case MediaViewModeMap:
            return mapRoute;
        default:
            // eslint-disable-next-line no-case-declarations
            const _exhaustiveCheck: never = mode;
            return _exhaustiveCheck;
    }
};
