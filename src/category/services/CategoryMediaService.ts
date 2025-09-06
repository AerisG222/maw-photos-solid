import { Navigator, Params } from "@solidjs/router";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { UseQueryResult } from "@tanstack/solid-query";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import {
    MediaView,
    MediaViewBulkEdit,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
} from "../../_models/MediaView";
import { IMediaService } from "../../_media/services/IMediaService";
import { bulkEditRoute, detailRoute, fullscreenRoute, gridRoute, mapRoute } from "../_routes";
import { MediaAppRouteDefinition } from "../../_models/MediaAppRouteDefinition";

export class CategoryMediaService extends BaseMediaService implements IMediaService {
    constructor(
        navigate: Navigator,
        params: Params,
        view: MediaView,
        protected categoryQuery: UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: UseQueryResult<Media[], Error>
    ) {
        super(navigate, params, view);
    }

    navigateToView = (view: MediaView) => {
        this.navigate(
            this.getEntryPathByView(view)
                .replace(":categoryId", this.params.categoryId)
                .replace("/:id?", "")
        );
    };

    navigateToFirstMediaIfNeeded = () => {
        const list = this.getMediaList();

        if (!this.params.id && list && list.length > 0) {
            this.navigateToMedia(this.view, list[0]);
        }
    };

    getActiveCategory = () => (this.categoryQuery.isSuccess ? this.categoryQuery.data : undefined);

    getMediaList = () => (this.mediaListQuery.isSuccess ? this.mediaListQuery.data : []);

    getEntryPathByView = (view: MediaView) =>
        this.getActiveCategory()
            ? this.getRouteForView(view).absolutePath.replace(
                ":categoryId",
                this.getActiveCategory()!.id
            ).replace("/:id?", "")
            : "";

    getMediaPathByView = (view: MediaView, media: Media | undefined): string =>
        media ? this.getMediaPath(this.getRouteForView(view), media) : "";

    getMediaPath = (route: MediaAppRouteDefinition, media: Media): string =>
        route.buildPathForMedia(this.getActiveCategory(), media);

    getRouteForView = (view: MediaView): MediaAppRouteDefinition => {
        switch (view) {
            case MediaViewDetail:
                return detailRoute;
            case MediaViewFullscreen:
                return fullscreenRoute;
            case MediaViewGrid:
                return gridRoute;
            case MediaViewMap:
                return mapRoute;
            case MediaViewBulkEdit:
                return bulkEditRoute;
            default:
                return gridRoute;
        }
    };

    getAvailableRoutes = () => [
        gridRoute,
        detailRoute,
        fullscreenRoute,
        mapRoute
        //bulkEditRoute   // todo: admin? owner?
    ];
}
