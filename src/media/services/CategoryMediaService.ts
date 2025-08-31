import { Navigator, Params } from "@solidjs/router";

import { BaseMediaService } from './BaseMediaService';
import { MediaView } from '../_routes';
import { UseQueryResult } from '@tanstack/solid-query';
import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { INavigable } from './INavigable';

export class CategoryMediaService extends BaseMediaService implements INavigable {
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

        if (!this.params.id && list) {
            this.navigateToMedia(list[0].id as Uuid, this.viewMode);
        }
    };

    getActiveCategory = () =>
        this.categoryQuery.isSuccess ? this.categoryQuery.data : undefined;

    getMediaList = () =>
        this.mediaListQuery.isSuccess ? this.mediaListQuery.data : [];
}
