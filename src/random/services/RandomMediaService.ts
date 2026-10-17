import { Accessor } from "solid-js";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";
import { IMediaService } from "../../_media/services/IMediaService";
import { gridView, randomGridLink } from "../_routes";
import { GoTo, MediaParams } from "../../_media/services/_navigation";

export class RandomMediaService extends BaseMediaService implements IMediaService {
    constructor(
        goTo: GoTo,
        params: Accessor<MediaParams>,
        view: MediaView,
        // accessors throughout - see the note in FeedMediaService
        protected categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: () => UseInfiniteQueryResult<
            InfiniteData<Media[] | undefined>,
            Error
        >
    ) {
        super(goTo, params, view);
    }

    override navigateToMedia = (view: MediaView, media: Media | undefined) => {
        this.goTo(this.getMediaLinkByView(view, media));
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

    getActiveCategory = () => this.categoryQuery().data;

    getMediaList = () => {
        const query = this.mediaListQuery();

        if (!query.isSuccess) {
            return [];
        }

        const list: Media[] = [];

        for (const page of query.data?.pages ?? []) {
            if (page) {
                list.push(...page);
            }
        }

        return list;
    };

    // one view - the grid - so the view asked for only matters once there are more
    getEntryLinkByView = (_view: MediaView) => randomGridLink();

    getMediaLinkByView = (_view: MediaView, media: Media | undefined) => randomGridLink(media);

    getAvailableViews = () => [gridView];

    fetchNextPage = async () => {
        await this.mediaListQuery().fetchNextPage();
    };

    override canRequestMore = () => true;

    override requestMore = () => {
        void this.mediaListQuery().fetchNextPage();
    };
}
