import { Accessor } from "solid-js";
import { LinkOptions, useNavigate, useParams, useRouter } from "@tanstack/solid-router";

import { Media } from "../../_models/Media";

// the parts of a media address every media route shares, each optional
export interface MediaParams {
    categoryYear?: string;
    categorySlug?: string;
    mediaSlug?: string;
}

/*
   Every param of the current match, typed across all the routes - a media
   service is shared by a category, a feed and the random stack, and asks the
   same three questions of each.
*/
export const useMediaParams = (): Accessor<MediaParams> => useParams({ strict: false });

/*
   Set on the history entry a photo is opened into from a listing, and carried
   along as it steps to its neighbors - each step replaces the entry rather than
   adding one. Closing the photo can then go back to the listing it came from
   instead of piling another entry on top, so Back leaves the listing rather
   than unwinding every photo that was looked at.
*/
declare module "@tanstack/history" {
    interface HistoryState {
        openedFromListing?: boolean;
    }
}

export type GoTo = (
    link: LinkOptions,
    // `state: true` keeps the current entry's state - see HistoryState above
    options?: { replace?: boolean; state?: true }
) => void;

/*
   Navigate by typed link, where going where you already are does nothing.

   TanStack Router reloads the whole match instead, handing every reader a new
   location - and the media screens keep the address where it belongs with
   effects that navigate when it is wrong, so each would run again on its own
   navigation and never stop. That froze the browser hard enough that its
   devtools would not open. The target is built the way the router builds it,
   so a trailing slash or a reordered query string is still the same place.
*/
export const useGoTo = (): GoTo => {
    const router = useRouter();
    const navigate = useNavigate();

    return (link, options) => {
        const target = router.buildLocation(link as Parameters<typeof router.buildLocation>[0]);
        const trim = (href: string) => href.replace(/\/+(?=$|\?|#)/, "");

        if (trim(target.href) === trim(router.latestLocation.href)) {
            return;
        }

        void navigate({
            ...link,
            replace: options?.replace,
            ...(options?.state ? { state: options.state } : {})
        } as Parameters<typeof navigate>[0]);
    };
};

/*
   The params a photo is addressed by where media spans categories - a feed, or
   the random stack - or none at all, for the listing itself.

   Always all three, undefined when there is no photo, and never left out. A
   link that leaves out one of its route's params does not mean "without it":
   TanStack Router fills it in from the current address. So the link back to a
   feed's grid, built with no params from a photo in that feed, led straight back
   to the same photo, and it could not be closed.
*/
export const photoParams = (media: Media | undefined) => ({
    categoryYear: media ? String(media.categoryYear) : undefined,
    categorySlug: media?.categorySlug,
    mediaSlug: media?.slug
});
