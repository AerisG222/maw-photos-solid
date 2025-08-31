import { Navigator, Params } from "@solidjs/router";

import { MediaView } from '../_routes';
import { UseQueryResult } from '@tanstack/solid-query';
import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { CategoryMediaService } from './CategoryMediaService';
import { GpsDetail } from '../../_models/GpsDetail';
import { createMemo } from 'solid-js';
import { GpsCoordinate } from '../../_models/GpsCoordinate';
import { MediaWithGps } from '../models/MediaWithGps';
import { INavigable } from './INavigable';

export class CategoryMapsMediaService extends CategoryMediaService implements INavigable {
    constructor(
        navigate: Navigator,
        params: Params,
        viewMode: MediaView,
        categoryQuery: UseQueryResult<Category, Error>,
        mediaListQuery: UseQueryResult<Media[], Error>,
        protected gpsListQuery: UseQueryResult<GpsDetail[], Error>,
    ) {
        super(navigate, params, viewMode, categoryQuery, mediaListQuery);
    }

    override navigateToFirstMediaIfNeeded = () => {
        const list = this.mediaWithGps();

        if (!this.params.id && list && list.length > 0) {
            this.navigateToMedia(list[0].media.id as Uuid, this.viewMode);
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

    getNextIdWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const nextIndex = this.getNextIndexWithGps(list, currId);

        return nextIndex ? list[nextIndex].media.id : undefined;
    };

    getPreviousIdWithGps = (list: MediaWithGps[], currId: Uuid) => {
        const prevIndex = this.getPreviousIndexWithGps(list, currId);

        return prevIndex ? list[prevIndex].media.id : undefined;
    };

    override moveNext = () => {
        const list = this.mediaWithGps();

        if (!this.params.id) {
            this.navigateToMedia(list[0].media.id, this.viewMode);
        }

        if (list && this.params.id) {
            const nextId = this.getNextIdWithGps(list, this.params.id as Uuid);

            if (nextId) {
                this.navigateToMedia(nextId, this.viewMode);
            }
        }
    };

    override movePrevious = () => {
        const list = this.mediaWithGps();

        if (list && this.params.id) {
            const prevId = this.getPreviousIdWithGps(list, this.params.id as Uuid);

            if (prevId) {
                this.navigateToMedia(prevId, this.viewMode);
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
