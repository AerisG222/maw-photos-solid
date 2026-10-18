import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { LinkOptions } from "@tanstack/solid-router";

import { MediaViewRoute } from "../../_models/MediaViewRoute";
import { MediaView } from "../../_models/MediaView";
import { INavigable } from "./INavigable";

export interface IMediaService extends INavigable {
    getMediaList(): Media[];
    getActiveCategory(): Category | undefined;
    getActiveMedia(): Media | undefined;
    navigateToMedia(view: MediaView, media: Media): void;
    navigateToFirstMediaIfNeeded(): void;
    // the views a toolbar can offer here, and the typed link into each
    getAvailableViews(): MediaViewRoute[];
    getEntryLinkByView(view: MediaView): LinkOptions;
    getMediaLinkByView(view: MediaView, media: Media | undefined): LinkOptions;
    // where next and previous would go from the open photo - none at either end
    getNeighbors(): { previous?: Media; next?: Media };
    canRequestMore(): boolean;
    requestMore(): void;
    /*
       Whether "download this whole category" means anything here.

       It does while browsing a category, where the category *is* what is being
       listed. It does not in a person's or a place's feed: the photograph on
       screen belongs to some category, but that category is incidental to the
       list, and offering to download all of it would be answering a question
       nobody asked.
    */
    canDownloadCategory(): boolean;
    /*
       Whether an administrator may make the open photograph its category's
       teaser, from the Inspector.

       The same line, drawn for the same reason: inside a category, choosing
       which of its photographs stands for it is the natural question. In a
       person's or a place's feed the category is incidental, and the old detail
       view offered the chooser only on the category screen for that reason.
       Deleting that view took the card's one "yes" with it, which is how it
       went missing.
    */
    canChooseCategoryTeaser(): boolean;
}
