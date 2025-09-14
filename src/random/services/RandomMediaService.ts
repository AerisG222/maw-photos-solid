import { Navigator, Params } from "@solidjs/router";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import {
    MediaView,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewGrid
} from "../../_models/MediaView";
import { IMediaService } from "../../_media/services/IMediaService";
import { detailRoute, fullscreenRoute, gridRoute } from "../_routes";
import { MediaAppRouteDefinition } from "../../_models/MediaAppRouteDefinition";

export class RandomMediaService extends BaseMediaService implements IMediaService {
    private intervalId?: number = undefined;

    constructor(
        navigate: Navigator,
        params: Params,
        view: MediaView,
        protected categoryQuery: UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: UseInfiniteQueryResult<InfiniteData<Media[] | undefined>, Error>
    ) {
        super(navigate, params, view);
    }

    override navigateToMedia = (view: MediaView, media: Media) => {
        this.navigate(this.getMediaPathByView(view, media));
    };

    navigateToFirstMediaIfNeeded = () => {
        const list = this.getMediaList();

        if (!this.params.id && list && list.length > 0) {
            this.navigateToMedia(this.view, list[0]);
        }
    };

    getActiveCategory = () => this.categoryQuery?.data;

    getMediaList = () => {
        if (!this.mediaListQuery.isSuccess) {
            return [];
        }

        const list: Media[] = [];

        for (const page of this.mediaListQuery.data?.pages ?? []) {
            if (page) {
                list.push(...page);
            }
        }

        return list;
    };

    getEntryPathByView = (view: MediaView) =>
        this.getRouteForView(view).absolutePath.replace("/:id?", "");

    getMediaPathByView = (view: MediaView, media: Media | undefined): string =>
        media ? this.getMediaPath(this.getRouteForView(view), media) : "";

    getMediaPath = (route: MediaAppRouteDefinition, media: Media): string =>
        route.buildPathForMedia(undefined, media);

    getRouteForView = (view: MediaView): MediaAppRouteDefinition => {
        switch (view) {
            case MediaViewDetail:
                return detailRoute;
            case MediaViewFullscreen:
                return fullscreenRoute;
            case MediaViewGrid:
                return gridRoute;
            default:
                return gridRoute;
        }
    };

    getAvailableRoutes = () => [gridRoute, detailRoute, fullscreenRoute];

    startPeriodicFetching = () => {
        if (this.intervalId) {
            return;
        }

        this.intervalId = setInterval(async () => {
            await this.mediaListQuery.fetchNextPage();
        }, 20 * 1000);
    }

    stopPeriodicFetching = () => {
        if (!this.intervalId) {
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    fetchNextPage = async () => {
        await this.mediaListQuery.fetchNextPage();
    }

    override canRequestMore = () => true;

    override requestMore = () => { this.mediaListQuery.fetchNextPage(); };
}
