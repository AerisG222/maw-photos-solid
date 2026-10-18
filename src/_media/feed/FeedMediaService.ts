import { Accessor } from "solid-js";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";

import { PagedMediaService } from "../services/PagedMediaService";
import { GoTo, MediaParams } from "../services/_navigation";
import { IMediaService } from "../services/IMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView, MediaViewGrid } from "../../_models/MediaView";
import { SearchResults } from "../../_models/SearchResults";
import { FeedSearch, FeedSubject, feedGridLink, gridView } from "./_routes";

type FeedMediaQuery = UseInfiniteQueryResult<InfiniteData<SearchResults<Media> | undefined>, Error>;

/*
   Drives a face or place feed - one person's media, a clan's, or a place's -
   over the shared media views. See PagedMediaService for why the queries
   arrive as accessors.
*/
export class FeedMediaService
    extends PagedMediaService<SearchResults<Media>>
    implements IMediaService
{
    constructor(
        goTo: GoTo,
        params: Accessor<MediaParams>,
        view: MediaView,
        protected subject: Accessor<FeedSubject>,
        // the filter the feed is being browsed under, so every link this service
        // hands out keeps the favorites and shuffle the user chose
        protected search: Accessor<FeedSearch>,
        categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        mediaListQuery: () => FeedMediaQuery
    ) {
        super(goTo, params, view, categoryQuery, mediaListQuery);
    }

    protected pageMedia(page: SearchResults<Media>) {
        return page.results;
    }

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
}
