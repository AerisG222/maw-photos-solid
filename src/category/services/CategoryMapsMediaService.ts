import { Navigator, Params } from "@solidjs/router";

import { UseQueryResult } from '@tanstack/solid-query';
import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { CategoryMediaService } from './CategoryMediaService';
import { GpsDetail } from '../../_models/GpsDetail';
import { createMemo } from 'solid-js';
import { GpsCoordinate } from '../../_models/GpsCoordinate';
import { MediaWithGps } from '../../_media/models/MediaWithGps';
import { MediaView } from '../../_media/models/MediaView';
import { IMapsMediaService } from '../../_media/services/IMapsMediaService';

export class CategoryMapsMediaService
    extends CategoryMediaService
    implements IMapsMediaService {
    constructor(
        navigate: Navigator,
        params: Params,
        view: MediaView,
        categoryQuery: UseQueryResult<Category | undefined, Error>,
        mediaListQuery: UseQueryResult<Media[], Error>,
        protected gpsListQuery: UseQueryResult<GpsDetail[], Error>,
    ) {
        super(navigate, params, view, categoryQuery, mediaListQuery);
    }

    override navigateToFirstMediaIfNeeded = () => {
        const list = this.mediaWithGps();

        if (!this.params.id && list && list.length > 0) {
            this.navigateToMedia(this.view, list[0].media);
        }
    };

    getCurrIndexWithGps = (list: MediaWithGps[], currId: Uuid) => list?.findIndex(x => x.media.id === currId);

    getNextIndexWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const nextIndex = this.getCurrIndexWithGps(list, currId) + 1;

        return nextIndex < list.length ? nextIndex : undefined;
    };

    getPreviousIndexWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const prevIndex = this.getCurrIndexWithGps(list, currId) - 1;

        return prevIndex >= 0 ? prevIndex : undefined;
    };

    getNextMediaWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const nextIndex = this.getNextIndexWithGps(list, currId);

        return nextIndex ? list[nextIndex].media : undefined;
    };

    getPreviousMediaWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const prevIndex = this.getPreviousIndexWithGps(list, currId);

        return prevIndex ? list[prevIndex].media : undefined;
    };

    override moveNext = () => {
        const list = this.mediaWithGps();

        if (!this.params.id) {
            this.navigateToMedia(this.view, list[0].media);
        }

        if (list && this.params.id) {
            const nextMedia = this.getNextMediaWithGps(list, this.params.id as Uuid);

            if (nextMedia) {
                this.navigateToMedia(this.view, nextMedia);
            }
        }
    };

    override movePrevious = () => {
        const list = this.mediaWithGps();

        if (list && this.params.id) {
            const prevMedia = this.getPreviousMediaWithGps(list, this.params.id as Uuid);

            if (prevMedia) {
                this.navigateToMedia(this.view, prevMedia);
            }
        }
    };

    isReady = () => this.gpsListQuery.isSuccess && this.mediaListQuery.isSuccess;

    getGpsList = () =>
        this.gpsListQuery.isSuccess ? this.gpsListQuery.data : [];

    preferredGpsLocation = (
        mediaWithGps: MediaWithGps | undefined
    ): GpsCoordinate | undefined =>
        mediaWithGps?.gps?.override ? mediaWithGps.gps.override : mediaWithGps?.gps.recorded;

    mediaWithGps = createMemo(() => {
        if (this.mediaListQuery && this.mediaListQuery.isSuccess && this.gpsListQuery && this.gpsListQuery.isSuccess) {
            return this.getGpsList().map(
                g =>
                    ({
                        media: this.getMediaList().find(m => m.id === g.mediaId),
                        gps: g
                    }) as MediaWithGps
            );
        }

        return [];
    });

    activeMediaGps = createMemo(() =>
        this.preferredGpsLocation(this.mediaWithGps().find(m => m.media.id === this.getActiveMedia()?.id))
    );
}
