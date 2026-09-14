import { Component, lazy } from "solid-js";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import {
    InspectorCardCategoryTeaser,
    InspectorCardComments,
    InspectorCardEffects,
    InspectorCardExif,
    InspectorCardHistogram,
    InspectorCardIdType,
    InspectorCardMetadata,
    InspectorCardMinimap,
    InspectorCardPlaceCovers
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
        component: lazy(() => import("../../_media/detail/CommentsCard"))
    },
    {
        id: InspectorCardExif,
        title: "EXIF Data",
        icon: "icon-[ic--round-tune]",
        appliesTo: always,
        component: lazy(() => import("../../_media/detail/ExifCard"))
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
        component: lazy(() => import("../../_media/detail/MinimapCard"))
    },
    {
        id: InspectorCardMetadata,
        title: "Metadata Editor",
        icon: "icon-[ic--round-edit]",
        appliesTo: context => context.isAdmin,
        component: lazy(() => import("../../_media/detail/MetadataEditorCard"))
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
        component: lazy(() => import("../../_media/detail/PlaceCoversCard"))
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
