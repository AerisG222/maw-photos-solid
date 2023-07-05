import { AppRouteDefinition } from '../../models/AppRouteDefinition';

export const MediaViewModeBulkEdit = "bulk-edit";
export const MediaViewModeDetail = "detail";
export const MediaViewModeGrid = "grid";
export const MediaViewModeMap = "map";

export type MediaViews =
    typeof MediaViewModeBulkEdit |
    typeof MediaViewModeDetail |
    typeof MediaViewModeGrid |
    typeof MediaViewModeMap;

export const MediaViewAll = [
    MediaViewModeBulkEdit,
    MediaViewModeDetail,
    MediaViewModeGrid,
    MediaViewModeMap,
];

export const buildMediaRoutes = (basePath: string, views: MediaViews[]): AppRouteDefinition[] => {

}
