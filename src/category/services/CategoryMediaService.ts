import { Navigator, Params } from "@solidjs/router";

import { BaseMediaService } from '../../media/services/BaseMediaService';
import { UseQueryResult } from '@tanstack/solid-query';
import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { MediaView } from '../../media/models/MediaView';
import { IMediaService } from '../../media/services/IMediaService';

export class CategoryMediaService
    extends BaseMediaService
    implements IMediaService {
    constructor(
        navigate: Navigator,
        params: Params,
        viewMode: MediaView,
        protected categoryQuery: UseQueryResult<Category, Error>,
        protected mediaListQuery: UseQueryResult<Media[], Error>,
    ) {
        super(navigate, params, viewMode);
    }

    navigateToFirstMediaIfNeeded = () => {
        const list = this.getMediaList();

        if (!this.params.id && list && list.length > 0) {
            this.navigateToMedia(list[0].id as Uuid, this.viewMode);
        }
    };

    getActiveCategory = () =>
        this.categoryQuery.isSuccess ? this.categoryQuery.data : undefined;

    getMediaList = () =>
        this.mediaListQuery.isSuccess ? this.mediaListQuery.data : [];
}
