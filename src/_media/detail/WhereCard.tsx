import { Component, For, Match, Show, Switch, createMemo } from "solid-js";
import { A } from "@solidjs/router";

import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { Media } from "../../_models/Media";
import { broadestFirst, getPlaceKindName } from "../../_models/Place";
import { placeFeedBasePath } from "../feed/_routes";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import Loading from "../../_components/loading/Loading";

interface Props {
    activeMedia: Media | undefined;
}

/*
   Where a photograph was taken, by name.

   The MiniMap already says where on earth; this says what that place is called,
   and each name leads to everything else taken there. The data was being
   fetched for every photograph already - but only the admin-only Place Covers
   card read it, and framed it around choosing covers, so for everybody else the
   answer to "where was this?" was an unlabelled pin.

   One row per rung the geocode actually resolved, broadest first. Not every rung
   exists everywhere: Macao and Hong Kong have no state level.
*/
const WhereCard: Component<Props> = props => {
    const { mediaPlacesQuery } = usePlacesContext();

    const mediaId = () => props.activeMedia?.id;
    // eslint-disable-next-line solid/reactivity -- an accessor, and the query re-keys itself when the photo changes
    const places = mediaPlacesQuery(mediaId);

    const ordered = createMemo(() => broadestFirst(places.data ?? []));

    return (
        <Switch fallback={<Loading />}>
            <Match when={places.isError}>
                <ErrorMessage
                    title="Could not load where this was taken"
                    error={places.error}
                    onRetry={() => void places.refetch()}
                />
            </Match>

            <Match when={places.isSuccess}>
                <Show
                    when={ordered().length > 0}
                    fallback={
                        <p class="text-sm text-muted">
                            Nowhere the geocoder recognised - this photograph has no location, or
                            one too remote to name.
                        </p>
                    }
                >
                    <ol class="flex flex-col gap-1" aria-label="Where this was taken">
                        <For each={ordered()}>
                            {place => (
                                <li>
                                    <A
                                        href={placeFeedBasePath(place.id)}
                                        class="flex items-center gap-2 rounded-field px-2 py-1 hover:bg-base-300 hover:text-primary"
                                    >
                                        <Icon classes="icon-[ic--round-place] shrink-0" />

                                        <span class="min-w-0 grow">
                                            <span class="block truncate">{place.name}</span>
                                            <span class="block text-xs text-muted">
                                                {getPlaceKindName(place.kind)}
                                            </span>
                                        </span>

                                        {/* how much more there is to see there, which is
                                            what makes following the link worth it */}
                                        <span class="badge badge-sm">{place.mediaCount}</span>
                                    </A>
                                </li>
                            )}
                        </For>
                    </ol>
                </Show>
            </Match>
        </Switch>
    );
};

export default WhereCard;
