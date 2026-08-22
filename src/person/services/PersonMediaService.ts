import { Navigator, Params } from "@solidjs/router";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { IMediaService } from "../../_media/services/IMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaAppRouteDefinition } from "../../_models/MediaAppRouteDefinition";
import {
    MediaView,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewGrid
} from "../../_models/MediaView";
import { SearchResults } from "../../_models/SearchResults";
import { getPersonMediaRoutes, stripMediaParams } from "../_routes";

export class PersonMediaService extends BaseMediaService implements IMediaService {
    constructor(
        navigate: Navigator,
        params: Params,
        view: MediaView,
        // the query string the feed is being browsed under, so every path this
        // service hands out keeps the filter and shuffle the user chose
        protected search: () => string,
        protected categoryQuery: UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: UseInfiniteQueryResult<
            InfiniteData<SearchResults<Media> | undefined>,
            Error
        >
    ) {
        super(navigate, params, view);
    }

    /*
       Read from the params on every call rather than captured once. Moving from
       one person to another keeps the same route, so the component - and this
       service with it - is reused while only the id changes.
    */
    // the route cannot match without the id, so it is always there
    private routes = () => getPersonMediaRoutes(this.params.personId!, this.search());

    private entryPath = (view: MediaView) =>
        `${this.getEntryPathWithoutFilter(view)}${this.search()}`;

    // the same path with no query string, for a caller that is about to apply a
    // filter of its own rather than carry the current one forward
    getEntryPathWithoutFilter = (view: MediaView) =>
        stripMediaParams(this.getRouteForView(view).absolutePath);

    override navigateToMedia = (view: MediaView, media: Media | undefined) => {
        this.navigate(this.getMediaPathByView(view, media));
    };

    navigateToViewIfMediaNotInList = () => {
        const activeMedia = this.getActiveMedia();

        if (!activeMedia) {
            this.navigateToMedia(this.view, undefined);
        }
    };

    navigateToFirstMediaIfNeeded = () => {
        const activeMedia = this.getActiveMedia();

        if (!activeMedia) {
            const list = this.getMediaList();

            if (list?.length > 0) {
                this.navigateToMedia(this.view, list[0]);
            }
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
                list.push(...page.results);
            }
        }

        return list;
    };

    getEntryPathByView = (view: MediaView) => this.entryPath(view);

    getMediaPathByView = (view: MediaView, media: Media | undefined): string =>
        media ? this.getMediaPath(this.getRouteForView(view), media) : this.entryPath(view);

    getMediaPath = (route: MediaAppRouteDefinition, media: Media): string =>
        route.buildPathForMedia(undefined, media);

    getRouteForView = (view: MediaView): MediaAppRouteDefinition => {
        const routes = this.routes();

        switch (view) {
            case MediaViewDetail:
                return routes.detail;
            case MediaViewFullscreen:
                return routes.fullscreen;
            case MediaViewGrid:
                return routes.grid;
            default:
                return routes.grid;
        }
    };

    getAvailableRoutes = () => {
        const routes = this.routes();

        return [routes.grid, routes.detail, routes.fullscreen];
    };

    /*
       Filtering can empty the feed outright - a person with no favorites is a
       real answer, not a broken link. Detail and fullscreen render around an
       active item and so have nowhere to say that, which leaves a blank screen;
       the grid is the one view that can, so they hand back to it.
    */
    navigateToGridIfEmpty = () => {
        if (this.getMediaList().length > 0) {
            return false;
        }

        this.navigate(this.entryPath(MediaViewGrid), { replace: true });

        return true;
    };

    // the feed is paged, so "more" is only offered while the API says another
    // page exists - unlike the random feed, which never runs out
    override canRequestMore = () => this.mediaListQuery.hasNextPage;

    override requestMore = () => {
        void this.mediaListQuery.fetchNextPage();
    };
}
