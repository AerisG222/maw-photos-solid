import { Accessor } from "solid-js";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";

import { BaseMediaService } from "../services/BaseMediaService";
import { GoTo, MediaParams } from "../services/_navigation";
import { IMediaService } from "../services/IMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView, MediaViewGrid } from "../../_models/MediaView";
import { SearchResults } from "../../_models/SearchResults";
import { FeedSearch, FeedSubject, feedGridLink, gridView } from "./_routes";

type FeedMediaQuery = UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;

/*
   Drives a face feed - one person's media, or a clan's - over the shared media
   views.

       Queries arrive as accessors, not as the results themselves. Both forms
       happen to work - a query result is a reactive store, so reading it later
       still tracks - but only one of them survives the query being *replaced*,
       which is what happens when a feed is re-keyed by a new filter or subject.
       Taking accessors throughout means every service reads the query that is
       current at the moment it is asked, and there is one rule rather than two.
*/
export class FeedMediaService extends BaseMediaService implements IMediaService {
    constructor(
        goTo: GoTo,
        params: Accessor<MediaParams>,
        view: MediaView,
        protected subject: Accessor<FeedSubject>,
        // the filter the feed is being browsed under, so every link this service
        // hands out keeps the favorites and shuffle the user chose
        protected search: Accessor<FeedSearch>,
        protected categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: () => FeedMediaQuery
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
                list.push(...page.results);
            }
        }

        return list;
    };

    // one view - the grid - so the view asked for only matters once there are more
    getEntryLinkByView = (_view: MediaView) =>
        feedGridLink(this.subject(), undefined, this.search());

    getMediaLinkByView = (_view: MediaView, media: Media | undefined) =>
        feedGridLink(this.subject(), media, this.search());

    getAvailableViews = () => [gridView];

    /*
       Filtering can empty the feed outright - a person with no favorites is a
       real answer, not a broken link. A view rendering around an active item
       has nowhere to say that, which leaves a blank screen; the grid is the one
       that can, so they hand back to it.
    */
    navigateToGridIfEmpty = () => {
        if (this.getMediaList().length > 0) {
            return false;
        }

        this.goTo(this.getEntryLinkByView(MediaViewGrid), { replace: true });

        return true;
    };

    // the feed is paged, so "more" is only offered while the API says another
    // page exists - unlike the random feed, which never runs out
    override canRequestMore = () => this.mediaListQuery().hasNextPage;

    override requestMore = () => {
        void this.mediaListQuery().fetchNextPage();
    };
}
