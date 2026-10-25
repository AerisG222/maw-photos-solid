import { Accessor } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";
import { UseQueryResult } from "@tanstack/solid-query";

import { BaseMediaService } from "../../_media/services/BaseMediaService";
import { GoTo, MediaParams } from "../../_media/services/_navigation";
import { IMediaService } from "../../_media/services/IMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView, MediaViewGrid } from "../../_models/MediaView";
import { categoriesGridRoute } from "../_routeTree";
import { CategoriesSearch } from "../_search";

/*
   The photo open over the categories grid while browsing every category's
   photos.

   Addressed by the grid's own search - `category` and `photo` - rather than a
   route of its own, so opening and closing one never leaves the page and the
   listing stays exactly where it was scrolled. Next and previous step through
   the open photo's category, as the listing shows it: the same filters apply.
*/
export class BrowseMediaService extends BaseMediaService implements IMediaService {
    constructor(
        goTo: GoTo,
        private search: Accessor<CategoriesSearch>,
        // accessors - see the note in FeedMediaService
        private categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        private media: Accessor<Media[] | undefined>
    ) {
        /*
           The base finds the open photo by year, category slug and photo slug,
           as every media route addresses one. Here the address names the
           category by id, so its year and slug come from the category itself.
        */
        const params = (): MediaParams => {
            const category = this.getActiveCategory();

            return {
                categoryYear: category ? String(category.year) : undefined,
                categorySlug: category?.slug,
                mediaSlug: this.search().photo
            };
        };

        super(goTo, params, MediaViewGrid);
    }

    getMediaList = () => this.media() ?? [];

    // read once and narrowed from that read - see CategoryMediaService
    getActiveCategory = () => {
        const query = this.categoryQuery();

        return query.isSuccess ? query.data : undefined;
    };

    // the listing is the entry point, so nothing is opened on arrival
    navigateToFirstMediaIfNeeded = () => {
        /* empty */
    };

    // the search as it stands, without a photo open - the filters stay put
    private listingSearch = (): CategoriesSearch => {
        const { category: _category, photo: _photo, ...rest } = this.search();

        return rest;
    };

    getEntryLinkByView = (_view?: MediaView) =>
        linkOptions({ to: categoriesGridRoute.to, search: this.listingSearch() });

    getMediaLinkByView = (_view: MediaView, media: Media | undefined) =>
        media
            ? linkOptions({
                  to: categoriesGridRoute.to,
                  search: { ...this.listingSearch(), category: media.categoryId, photo: media.slug }
              })
            : this.getEntryLinkByView();

    // one way of looking at it: the grid this is already on
    getAvailableViews = () => [];

    // choosing which photo stands for its category is a natural thing to do from here
    override canChooseCategoryTeaser = () => true;
}
