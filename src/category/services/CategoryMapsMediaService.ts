import { Navigator, Params } from "@solidjs/router";
import { UseQueryResult } from "@tanstack/solid-query";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { CategoryMediaService } from "./CategoryMediaService";
import { GpsDetail } from "../../_models/GpsDetail";
import { GpsCoordinate } from "../../_models/GpsCoordinate";
import { MediaWithGps } from "../../_media/models/MediaWithGps";
import { MediaView } from "../../_models/MediaView";
import { IMapsMediaService } from "../../_media/services/IMapsMediaService";

export class CategoryMapsMediaService extends CategoryMediaService implements IMapsMediaService {
    constructor(
        navigate: Navigator,
        params: Params,
        view: MediaView,
        categoryQuery: () => UseQueryResult<Category | undefined, Error>,
        mediaListQuery: () => UseQueryResult<Media[], Error>,
        protected gpsListQuery: () => UseQueryResult<GpsDetail[], Error>
    ) {
        super(navigate, params, view, categoryQuery, mediaListQuery);
    }

    override navigateToFirstMediaIfNeeded = () => {
        const activeMedia = this.getActiveMedia();

        if (!activeMedia) {
            const list = this.mediaWithGps();

            if (list && list.length > 0) {
                this.navigateToMedia(this.view, list[0].media);
            }
        }
    };

    /*
       The photos with a location either side of the active one, in the
       category's order - which are the only ones the map can move to.

       Found by where each sits in the whole category, so they are found from a
       photo without a location too: the map can be opened on one, from the grid
       or a link, and looking it up among the located photos found nothing, so
       next, previous and the slideshow all quietly did nothing. With no photo
       active, both lead to the first.
    */
    private locatedNeighbors = () => {
        const located = this.mediaWithGps();
        const order = new Map(this.getMediaList().map((media, i) => [media.id, i]));
        const active = this.getActiveMedia();
        const activeIndex = active ? order.get(active.id) : undefined;

        if (activeIndex === undefined) {
            return { previous: located[0]?.media, next: located[0]?.media };
        }

        const indexOf = (item: MediaWithGps) => order.get(item.media.id) ?? -1;

        return {
            previous: located.findLast(item => indexOf(item) < activeIndex)?.media,
            next: located.find(item => indexOf(item) > activeIndex)?.media
        };
    };

    override moveNext = () => {
        const next = this.locatedNeighbors().next;

        if (next) {
            this.navigateToMedia(this.view, next);
        }
    };

    override movePrevious = () => {
        const previous = this.locatedNeighbors().previous;

        if (previous) {
            this.navigateToMedia(this.view, previous);
        }
    };

    override isActiveMediaFirst = () => !this.locatedNeighbors().previous;

    override isActiveMediaLast = () => !this.locatedNeighbors().next;

    isReady = () =>
        this.gpsListQuery().isSuccess &&
        this.mediaListQuery().isSuccess &&
        this.categoryQuery().isSuccess &&
        (!this.params.mediaSlug || !!this.getActiveMedia());

    // read once, so `isSuccess` narrows the data on the same value
    getGpsList = () => {
        const query = this.gpsListQuery();

        return query.isSuccess ? query.data : [];
    };

    preferredGpsLocation = (mediaWithGps: MediaWithGps | undefined): GpsCoordinate | undefined =>
        mediaWithGps?.gps?.override ?? mediaWithGps?.gps?.recorded;

    mediaWithGps = () => {
        if (this.mediaListQuery().isSuccess && this.gpsListQuery().isSuccess) {
            const mediaWithGps: MediaWithGps[] = [];

            // iterate over the original list to maintain sort order that is consistent w/ other views
            for (const media of this.getMediaList()) {
                const gps = this.getGpsList().find(g => g.mediaId === media.id);

                if (gps) {
                    mediaWithGps.push({
                        media,
                        gps
                    });
                }
            }

            return mediaWithGps;
        }

        return [];
    };

    activeMediaGps = () =>
        this.preferredGpsLocation(
            this.mediaWithGps().find(m => m.media.id === this.getActiveMedia()?.id)
        );
}
