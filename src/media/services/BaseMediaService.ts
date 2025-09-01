import { Navigator, Params } from "@solidjs/router";

import { Category } from '../../_models/Category';
import { Media } from '../../_models/Media';
import { INavigable } from './INavigable';
import { MediaView } from '../models/MediaView';
import { getMediaPathByView } from '../models/RouteHelpers';

export abstract class BaseMediaService implements INavigable {
    constructor(
        protected navigate: Navigator,
        protected params: Params,
        protected viewMode: MediaView
    ) { }

    abstract getMediaList(): Media[];
    abstract getActiveCategory(): Category | undefined;

    getActiveMedia = () => {
        if (!this.params.id) {
            return undefined;
        }

        const list = this.getMediaList();

        if (!list) {
            return undefined;
        }

        return list.find(m => m.id === this.params.id);
    }

    navigateToMedia = (mediaId: Uuid, mode: MediaView) => {
        this.navigate(getMediaPathByView(mode, this.params.categoryId as Uuid, mediaId));
    };

    getCurrIndex = (list: Media[], currId: Uuid) => list?.findIndex(x => x.id === currId);

    getNextIndex = (list: Media[], currId: Uuid) => {
        const nextIndex = this.getCurrIndex(list, currId) + 1;

        return nextIndex < list.length ? nextIndex : undefined;
    };

    getPreviousIndex = (list: Media[], currId: Uuid) => {
        const prevIndex = this.getCurrIndex(list, currId) - 1;

        return prevIndex >= 0 ? prevIndex : undefined;
    };

    getNextId = (list: Media[], currId: Uuid) => {
        const nextIndex = this.getNextIndex(list, currId);

        return nextIndex ? list[nextIndex].id : undefined;
    };

    getPreviousId = (list: Media[], currId: Uuid) => {
        const prevIndex = this.getPreviousIndex(list, currId);

        return prevIndex !== undefined ? list[prevIndex].id : undefined;
    };

    moveNext = () => {
        const list = this.getMediaList();

        if (!this.params.id) {
            this.navigateToMedia(list[0].id, this.viewMode);
        }

        if (list && this.params.id) {
            const nextId = this.getNextId(list, this.params.id as Uuid);

            if (nextId) {
                this.navigateToMedia(nextId, this.viewMode);
            }
        }
    };

    movePrevious = () => {
        const list = this.getMediaList();

        if (list && this.params.id) {
            const prevId = this.getPreviousId(list, this.params.id as Uuid);

            if (prevId) {
                this.navigateToMedia(prevId, this.viewMode);
            }
        }
    };

    isActiveMediaFirst = () => {
        const list = this.getMediaList();

        if (!list) {
            return true;
        }

        return list[0].id === this.getActiveMedia()?.id;
    };

    isActiveMediaLast = () => {
        const list = this.getMediaList();

        if (!list) {
            return true;
        }

        return list[list.length - 1].id === this.getActiveMedia()?.id;
    };
}
