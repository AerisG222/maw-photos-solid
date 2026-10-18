import { Component, lazy } from "solid-js";
import { QueryClient } from "@tanstack/solid-query";

import { GetToken } from "../../_contexts/api/_configQueries";
import {
    commentsQueryOptions,
    facesQueryOptions,
    gpsQueryOptions,
    mediaRolesQueryOptions,
    metadataQueryOptions
} from "../../_contexts/api/_mediaQueries";
import { mediaPlacesQueryOptions } from "../../_contexts/api/_placesQueries";
import { peopleQueryOptions } from "../../_contexts/api/_peopleQueries";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import {
    InspectorCardAccess,
    InspectorCardCategoryTeaser,
    InspectorCardComments,
    InspectorCardEffects,
    InspectorCardExif,
    InspectorCardHistogram,
    InspectorCardIdType,
    InspectorCardMetadata,
    InspectorCardMinimap,
    InspectorCardPlaceCovers,
    InspectorCardWhere,
    InspectorCardWho
} from "../../_models/InspectorCard";
import { MediaView, MediaViewMap } from "../../_models/MediaView";

// everything a card needs to decide whether it has anything to say
export interface InspectorContext {
    readonly view: MediaView;
    readonly media: Media | undefined;
    readonly category: Category | undefined;
    readonly isAdmin: boolean;
    // a category teaser only means something while browsing that category
    readonly enableCategoryTeaser: boolean;
    // the histogram reads pixels off the element showing the photograph
    readonly hasMediaElement: boolean;
}

export interface InspectorCardProps {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    mediaElement: HTMLImageElement | HTMLVideoElement | undefined;
    requestMoveNext: () => void;
}

export interface InspectorCardDescriptor {
    readonly id: InspectorCardIdType;
    readonly title: string;
    readonly icon: string;
    /*
       Whether this card applies where it is being asked from. The rail shows
       only the cards that do; one the reader had open where it does not apply is
       remembered and hidden rather than forgotten, which is how a single stored
       list of cards works across every view.
    */
    readonly appliesTo: (context: InspectorContext) => boolean;
    readonly component: Component<InspectorCardProps>;
    /*
       What the card reads about the photo it shows, started for a photo that
       is not open yet - the ones either side of the open one, so stepping to
       either finds the card's answer already there. The same definitions the
       card's own queries use, so they land where it reads. Absent for a card
       that reads nothing of its own: the histogram is worked out from the
       picture, the effects are settings.
    */
    readonly prefetch?: (queryClient: QueryClient, getToken: GetToken, media: Media) => void;
}

const always = () => true;

/*
   The cards, in the order the rail offers them.

   This list is the whole reason the inspector can be mounted anywhere: what a
   card is, when it applies and how to build it are declared here rather than
   assembled inside the one view that used to own them.
*/
export const inspectorCards: InspectorCardDescriptor[] = [
    {
        id: InspectorCardComments,
        title: "Comments",
        icon: "icon-[ic--round-comment]",
        appliesTo: always,
        component: lazy(() => import("../../_media/detail/CommentsCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(commentsQueryOptions(getToken, media.id))
    },
    {
        id: InspectorCardExif,
        title: "EXIF Data",
        icon: "icon-[ic--round-tune]",
        appliesTo: always,
        component: lazy(() => import("../../_media/detail/ExifCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(metadataQueryOptions(getToken, media.id))
    },
    {
        /*
           Who is in it. Photographs only - faces are detected on stills, and a
           video would only ever offer an empty card.
        */
        id: InspectorCardWho,
        title: "Who",
        icon: "icon-[ic--round-people]",
        appliesTo: context => context.media?.type === "photo",
        component: lazy(() => import("../../_media/detail/WhoCard")),
        prefetch: (queryClient, getToken, media) => {
            void queryClient.prefetchQuery(facesQueryOptions(getToken, media.id));
            void queryClient.prefetchQuery(peopleQueryOptions(getToken));
        }
    },
    {
        /*
           Where it was taken, by name. Everyone, unlike Place Covers below, which
           reads the same data for an admin's purposes - see WhereCard.
        */
        id: InspectorCardWhere,
        title: "Where",
        icon: "icon-[ic--round-place]",
        appliesTo: always,
        component: lazy(() => import("../../_media/detail/WhereCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(mediaPlacesQueryOptions(getToken, media.id))
    },
    {
        id: InspectorCardEffects,
        title: "Adjust",
        icon: "icon-[ic--round-photo-filter]",
        appliesTo: always,
        component: lazy(() => import("../../_media/detail/EffectsCard"))
    },
    {
        id: InspectorCardHistogram,
        title: "Histogram",
        icon: "icon-[ic--round-color-lens]",
        // it reads the pixels of the element on screen, and the map has none
        appliesTo: context => context.hasMediaElement,
        component: lazy(() => import("../../_media/detail/HistogramCard"))
    },
    {
        id: InspectorCardMinimap,
        title: "MiniMap",
        icon: "icon-[ic--round-map]",
        // on the map itself it would say the same thing twice
        appliesTo: context => context.view !== MediaViewMap,
        component: lazy(() => import("../../_media/detail/MinimapCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(gpsQueryOptions(getToken, media.id))
    },
    {
        id: InspectorCardMetadata,
        title: "Metadata Editor",
        icon: "icon-[ic--round-edit]",
        appliesTo: context => context.isAdmin,
        component: lazy(() => import("../../_media/detail/MetadataEditorCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(gpsQueryOptions(getToken, media.id))
    },
    {
        id: InspectorCardCategoryTeaser,
        title: "Category Teaser",
        icon: "icon-[ic--round-image-search]",
        appliesTo: context => context.isAdmin && context.enableCategoryTeaser,
        component: lazy(() => import("../../_media/detail/CategoryTeaserCard"))
    },
    {
        /*
           The teaser treatment, for the places a photograph was taken. Not gated
           on the feed it is being viewed in, unlike the teaser above: a category
           teaser only means something while browsing that category, while where
           a photograph was taken travels with it.
        */
        id: InspectorCardPlaceCovers,
        title: "Place Covers",
        icon: "icon-[ic--round-place]",
        appliesTo: context => context.isAdmin,
        component: lazy(() => import("../../_media/detail/PlaceCoversCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(mediaPlacesQueryOptions(getToken, media.id))
    },
    {
        // who may see it, when that is fewer than its category is shared with
        id: InspectorCardAccess,
        title: "Access",
        icon: "icon-[ic--round-lock]",
        appliesTo: context => context.isAdmin,
        component: lazy(() => import("../../_media/detail/AccessCard")),
        prefetch: (queryClient, getToken, media) =>
            void queryClient.prefetchQuery(mediaRolesQueryOptions(getToken, media.id))
    }
];

/*
   Nothing applies without a photograph to apply it to.

   Every card reaches into the item without checking, because the detail view
   could only ever render them with one open - the view itself was gated on it.
   A grid or a map can be looked at with nothing selected, so the rule lives here
   rather than in each of the eight cards.
*/
export const applicableCards = (context: InspectorContext) =>
    context.media ? inspectorCards.filter(card => card.appliesTo(context)) : [];
