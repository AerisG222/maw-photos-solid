import { Navigator, Params } from "@solidjs/router";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";

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

    canRequestMore = () => false;
    requestMore = () => {
        /* empty */
    };

    getActiveMedia = () => {
        if (
            !this.params.categoryYear &&
            !this.params.categorySlug &&
            !this.params.mediaSlug
        ) {
            return undefined;
        }

        const list = this.getMediaList();

        return this.findMediaBySlug(
            list,
            this.params.categoryYear,
            this.params.categorySlug,
            this.params.mediaSlug
        );
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
        const currMedia = this.findMediaBySlug(
            list,
            this.params.categoryYear,
            this.params.categorySlug,
            this.params.mediaSlug
        );

        if (!currMedia) {
            this.navigateToMedia(this.view, list[0]);
        } else {
            const nextMedia = this.getNextMedia(list, currMedia.id);

            if (nextMedia) {
                this.navigateToMedia(this.view, nextMedia);
            }
        }
    };

    movePrevious = () => {
        const list = this.getMediaList();
        const currMedia = this.findMediaBySlug(
            list,
            this.params.categoryYear,
            this.params.categorySlug,
            this.params.mediaSlug
        );

        if (!currMedia) {
            this.navigateToMedia(this.view, list[0]);
        } else {
            const prevMedia = this.getPreviousMedia(list, currMedia.id);

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

    protected findMediaBySlug = (list?: Media[], categoryYearAsString?: string, categorySlug?: string, mediaSlug?: string) =>
        (list && categoryYearAsString && categorySlug && mediaSlug)
            ? list?.find(m =>
                m.categoryYear === parseInt(categoryYearAsString, 10) &&
                m.categorySlug === categorySlug &&
                m.slug === mediaSlug
            )
            : undefined;
}
