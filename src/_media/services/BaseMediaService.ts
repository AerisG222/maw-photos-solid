import { Accessor } from "solid-js";
import { LinkOptions } from "@tanstack/solid-router";

import { GoTo, MediaParams } from "./_navigation";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";

export abstract class BaseMediaService {
    constructor(
        protected goTo: GoTo,
        protected params: Accessor<MediaParams>,
        protected view: MediaView
    ) {}

    abstract getMediaList(): Media[];
    abstract getActiveCategory(): Category | undefined;
    abstract getEntryLinkByView(view: MediaView): LinkOptions;
    abstract getMediaLinkByView(view: MediaView, media: Media | undefined): LinkOptions;

    canRequestMore = () => false;
    // only a category listing can answer for a whole category - see IMediaService
    canDownloadCategory = () => false;
    canChooseCategoryTeaser = () => false;
    requestMore = () => {
        /* empty */
    };

    getActiveMedia = () => {
        if (
            !this.params().categoryYear &&
            !this.params().categorySlug &&
            !this.params().mediaSlug
        ) {
            return undefined;
        }

        const list = this.getMediaList();

        return this.findMediaBySlug(
            list,
            this.params().categoryYear,
            this.params().categorySlug,
            this.params().mediaSlug
        );
    };

    navigateToMedia = (view: MediaView, media: Media) => {
        this.goTo(this.getMediaLinkByView(view, media));
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
            this.params().categoryYear,
            this.params().categorySlug,
            this.params().mediaSlug
        );

        if (!currMedia) {
            const first = list[0];

            if (first) {
                this.navigateToMedia(this.view, first);
            }
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
            this.params().categoryYear,
            this.params().categorySlug,
            this.params().mediaSlug
        );

        if (!currMedia) {
            const first = list[0];

            if (first) {
                this.navigateToMedia(this.view, first);
            }
        } else {
            const prevMedia = this.getPreviousMedia(list, currMedia.id);

            if (prevMedia) {
                this.navigateToMedia(this.view, prevMedia);
            }
        }
    };

    /*
       An empty list - not loaded yet, or a filter that leaves nothing - is at
       both ends at once. Testing the list itself, as these used to, never
       caught that: an empty array is truthy, so the first item was read from
       nothing, and a slideshow running when its feed emptied threw.
    */
    isActiveMediaFirst = () => {
        const first = this.getMediaList()[0];

        return !first || first.id === this.getActiveMedia()?.id;
    };

    isActiveMediaLast = () => {
        const last = this.getMediaList().at(-1);

        return !last || last.id === this.getActiveMedia()?.id;
    };

    protected findMediaBySlug = (
        list?: Media[],
        categoryYearAsString?: string,
        categorySlug?: string,
        mediaSlug?: string
    ) =>
        list && categoryYearAsString && categorySlug && mediaSlug
            ? list?.find(
                  m =>
                      m.categoryYear === parseInt(categoryYearAsString, 10) &&
                      m.categorySlug === categorySlug &&
                      m.slug === mediaSlug
              )
            : undefined;
}
