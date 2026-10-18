import { Accessor } from "solid-js";
import { UseQueryResult } from "@tanstack/solid-query";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { GoTo, MediaParams } from "../../_media/services/_navigation";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";
import { IMediaService } from "../../_media/services/IMediaService";
import { bulkEditView, categoryViewLink, gridView, mapView } from "../_routes";

export class CategoryMediaService extends BaseMediaService implements IMediaService {
    constructor(
        goTo: GoTo,
        params: Accessor<MediaParams>,
        view: MediaView,
        // accessors throughout - see the note in FeedMediaService
        protected categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        protected mediaListQuery: () => UseQueryResult<Media[], Error>
    ) {
        super(goTo, params, view);
    }

    navigateToView = (view: MediaView) => {
        this.goTo(this.getEntryLinkByView(view), { replace: true });
    };

    navigateToFirstMediaIfNeeded = () => {
        const first = this.getMediaList()[0];

        if (!this.params().mediaSlug && first) {
            this.navigateToMedia(this.view, first);
        }
    };

    // read once and narrowed from that read: calling the accessor twice hands
    // back two separate values, and typescript cannot carry `isSuccess` across
    // them
    getActiveCategory = () => {
        const query = this.categoryQuery();

        return query.isSuccess ? query.data : undefined;
    };

    getMediaList = () => {
        const query = this.mediaListQuery();

        return query.isSuccess ? query.data : [];
    };

    // the category is the one the address names, which every category route has
    getEntryLinkByView = (view: MediaView) =>
        categoryViewLink(view, this.params().categoryYear!, this.params().categorySlug!);

    getMediaLinkByView = (view: MediaView, media: Media | undefined) =>
        categoryViewLink(
            view,
            this.params().categoryYear!,
            this.params().categorySlug!,
            media?.slug
        );

    getAvailableViews = () => [gridView, mapView, bulkEditView];

    // this listing *is* a category
    override canDownloadCategory = () => true;
    override canChooseCategoryTeaser = () => true;
}
