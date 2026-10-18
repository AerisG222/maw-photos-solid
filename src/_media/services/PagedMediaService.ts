import { Accessor } from "solid-js";
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";

import { BaseMediaService } from "./BaseMediaService";
import { GoTo, MediaParams } from "./_navigation";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";

/*
   A stack of media read a page at a time - the random stack, or a face or
   place feed - over the shared media views. What a page holds is all that
   differs between them; see `pageMedia`.

       Queries arrive as accessors, not as the results themselves. Both forms
       happen to work - a query result is a reactive store, so reading it later
       still tracks - but only one of them survives the query being *replaced*,
       which is what happens when a feed is re-keyed by a new filter or subject.
       Taking accessors throughout means every service reads the query that is
       current at the moment it is asked, and there is one rule rather than two.
*/
export abstract class PagedMediaService<TPage> extends BaseMediaService {
    constructor(
        goTo: GoTo,
        params: Accessor<MediaParams>,
        view: MediaView,
        protected categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: () => UseInfiniteQueryResult<
            InfiniteData<TPage | undefined>,
            Error
        >
    ) {
        super(goTo, params, view);
    }

    // the media one page carries
    protected abstract pageMedia(page: TPage): Media[];

    override navigateToMedia = (view: MediaView, media: Media | undefined) => {
        this.goTo(this.getMediaLinkByView(view, media));
    };

    navigateToViewIfMediaNotInList = () => {
        if (!this.getActiveMedia()) {
            this.navigateToMedia(this.view, undefined);
        }
    };

    navigateToFirstMediaIfNeeded = () => {
        if (!this.getActiveMedia()) {
            const first = this.getMediaList()[0];

            if (first) {
                this.navigateToMedia(this.view, first);
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
                list.push(...this.pageMedia(page));
            }
        }

        return list;
    };

    override requestMore = () => {
        void this.mediaListQuery().fetchNextPage();
    };
}
