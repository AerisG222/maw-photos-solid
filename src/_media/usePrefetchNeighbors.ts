import { createEffect, on } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";

import { useAuthContext } from "../_contexts/AuthContext";
import { useConfigContext } from "../_contexts/api/ConfigContext";
import { useListingSettingsContext } from "../_contexts/settings/ListingSettingsContext";
import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { facesQueryOptions } from "../_contexts/api/_mediaQueries";
import { applicableCards } from "../_components/inspector/registry";
import { Media } from "../_models/Media";
import { MediaView } from "../_models/MediaView";
import { getMainMediaUrl } from "../_models/utils/MediaUtils";
import { IMediaService } from "./services/IMediaService";

/*
   The photos either side of the open one, made ready before they are asked
   for.

   Every step - an arrow, a swipe, a slideshow tick - opened a photo whose
   picture, and whose inspector cards, had not been asked for yet, so each step
   waited on all of them again. Now, whenever a photo opens, the ones next and
   previous start loading: the picture itself, the faces if the overlay is on,
   and whatever each open card shows - only the cards the reader has open, and
   only those that apply there, as the inspector itself decides. Each card says
   what it reads; see `prefetch` in the inspector's registry.

   Only photographs have their file fetched ahead. A video is far larger, and
   playing it is a choice the reader has not made yet.
*/
export const usePrefetchNeighbors = (props: { mediaService: IMediaService; view: MediaView }) => {
    const queryClient = useQueryClient();
    const [auth, { getToken }] = useAuthContext();
    const { getScalesForMain } = useConfigContext();
    const [mediaSettings] = useMediaSettingsContext();
    const [listing] = useListingSettingsContext();

    const prepare = (media: Media) => {
        if (media.type === "photo") {
            new Image().src = getMainMediaUrl(media, getScalesForMain());
        }

        if (listing.highlightFaces) {
            void queryClient.prefetchQuery(facesQueryOptions(getToken, media.id));
        }

        if (!mediaSettings.inspectorOpen) {
            return;
        }

        const cards = applicableCards({
            view: props.view,
            media,
            category: props.mediaService.getActiveCategory(),
            isAdmin: !!auth.accountStatus?.isAdmin,
            enableCategoryTeaser: props.mediaService.canChooseCategoryTeaser(),
            // the histogram reads the picture, and reads nothing ahead of time
            hasMediaElement: true
        });

        for (const card of cards) {
            if (mediaSettings.inspectorCards.includes(card.id)) {
                card.prefetch?.(queryClient, getToken, media);
            }
        }
    };

    createEffect(
        on(
            () => props.mediaService.getActiveMedia()?.id,
            id => {
                if (!id || !auth.isLoggedIn) {
                    return;
                }

                const { previous, next } = props.mediaService.getNeighbors();

                // next first: it is the way a slideshow, and most readers, are going
                for (const neighbor of [next, previous]) {
                    if (neighbor) {
                        prepare(neighbor);
                    }
                }
            }
        )
    );
};
