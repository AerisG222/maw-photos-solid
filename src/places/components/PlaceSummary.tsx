import { Component, Show } from "solid-js";
import { A } from "@solidjs/router";

import { describePlaceAncestry, getPlaceKindName, Place } from "../../_models/Place";
import { feedListingPath, placeFeedBasePath } from "../../_media/feed/_routes";

import Icon from "../../_components/icon/Icon";

interface Props {
    place: Place;
}

/*
   The place currently being looked at, and the two ways into what was taken
   there.

   The photographs link points at the feed's own entry rather than at a named
   view, so it opens on whichever the caller last used - the same preference the
   people feeds are opened on.

   `mediaCount` covers the whole subtree, so a country's number includes every
   photograph in its states and cities. That is what makes it worth showing next
   to the tiles below, which each carry their own share of it.
*/
const PlaceSummary: Component<Props> = props => {
    const feedPath = () => placeFeedBasePath(props.place.id);

    return (
        <div class="flex flex-wrap items-center gap-4 my-2 p-3 rounded-sm bg-base-200 border border-secondary/20">
            <Show
                when={props.place.coverUrl}
                fallback={
                    <div class="flex items-center justify-center w-48 aspect-4/3 rounded-sm bg-base-300 text-base-content/40">
                        <Icon classes="icon-[ic--round-place] text-4xl" />
                    </div>
                }
            >
                <img
                    src={props.place.coverUrl!}
                    alt={`Cover of ${props.place.name}`}
                    class="w-48 aspect-4/3 object-cover rounded-sm"
                />
            </Show>

            <div class="flex flex-col gap-2 min-w-0">
                <div>
                    <div class="text-xl font-bold">{props.place.name}</div>

                    <Show when={props.place.ancestorNames.length > 0}>
                        <div class="text-sm opacity-70">{describePlaceAncestry(props.place)}</div>
                    </Show>

                    <div class="text-sm opacity-70">
                        {getPlaceKindName(props.place.kind)} &middot; {props.place.mediaCount} media
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    <A class="btn btn-sm btn-primary" href={feedPath()}>
                        <Icon classes="icon-[ic--round-image]" />
                        Photos &amp; Videos
                    </A>

                    <A
                        class="btn btn-sm btn-outline"
                        href={feedListingPath(feedPath(), "categories", false)}
                    >
                        <Icon classes="icon-[ic--round-collections]" />
                        Categories
                    </A>
                </div>
            </div>
        </div>
    );
};

export default PlaceSummary;
