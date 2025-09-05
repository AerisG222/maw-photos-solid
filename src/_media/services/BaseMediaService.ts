import { Navigator, Params } from "@solidjs/router";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";

export abstract class BaseMediaService {
    constructor(
        protected navigate: Navigator,
        protected params: Params,
        protected view: MediaView
    ) {}

    abstract getMediaList(): Media[];
    abstract getActiveCategory(): Category | undefined;
    abstract getEntryPathByView(view: MediaView): string;
    abstract getMediaPathByView(view: MediaView, media: Media | undefined): string;

    getActiveMedia = () => {
        if (!this.params.id) {
            return undefined;
        }

        const list = this.getMediaList();

        if (!list) {
            return undefined;
        }

        return list.find(m => m.id === this.params.id);
    };

    navigateToMedia = (view: MediaView, media: Media) => {
        this.navigate(this.getMediaPathByView(view, media));
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

    getNextMedia = (list: Media[], currId: Uuid) => {
        const nextIndex = this.getNextIndex(list, currId);

        return nextIndex ? list[nextIndex] : undefined;
    };

    getPreviousMedia = (list: Media[], currId: Uuid) => {
        const prevIndex = this.getPreviousIndex(list, currId);

        return prevIndex !== undefined ? list[prevIndex] : undefined;
    };

    moveNext = () => {
        const list = this.getMediaList();

        if (!this.params.id) {
            this.navigateToMedia(this.view, list[0]);
        }

        if (list && this.params.id) {
            const nextMedia = this.getNextMedia(list, this.params.id as Uuid);

            if (nextMedia) {
                this.navigateToMedia(this.view, nextMedia);
            }
        }
    };

    movePrevious = () => {
        const list = this.getMediaList();

        if (list && this.params.id) {
            const prevMedia = this.getPreviousMedia(list, this.params.id as Uuid);

            if (prevMedia) {
                this.navigateToMedia(this.view, prevMedia);
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
