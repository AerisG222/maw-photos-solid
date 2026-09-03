import { Component, For, Match, Show, Switch } from "solid-js";

import { ApiError, describeError } from "../../_contexts/api/ApiError";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { getPlaceKindName, Place } from "../../_models/Place";
import { Media } from "../../_models/Media";

import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import Loading from "../../_components/loading/Loading";

interface Props {
    activeMedia: Media | undefined;
}

/*
   Publishes the photograph on screen as the cover of the places it was taken -
   its country, its state and its city.

   The category teaser treatment, applied to places: the decision "this one
   represents here" is made while looking at the photograph, not while paging a
   picker, so the sidebar is where it belongs. The admin screen at /admin/places
   is still the place to hunt for a cover; this is the place to recognise one.

   One row per rung the geocode actually resolved, rather than three by
   assumption - Macao and Hong Kong have no state level, so a photograph there
   offers two.
*/
const PlaceCoversCard: Component<Props> = props => {
    const { mediaPlacesQuery, setCoverMutation } = usePlacesContext();

    const mediaId = () => props.activeMedia?.id;
    // eslint-disable-next-line solid/reactivity -- an accessor, and the query re-keys itself when the photo changes
    const places = mediaPlacesQuery(mediaId);

    // which rung this photograph already represents, so a click that would
    // change nothing is offered as a statement instead
    const isCurrent = (place: Place) =>
        !!props.activeMedia && place.coverMediaId === props.activeMedia.id;

    const replace = (place: Place) => {
        const media = props.activeMedia;

        if (media && !setCoverMutation.isPending) {
            setCoverMutation.mutate({ placeId: place.id, mediaId: media.id });
        }
    };

    const errorMessage = () => {
        const error = setCoverMutation.error;

        if (!error) {
            return undefined;
        }

        // the api layer carries the status but not the body, and a 400 here is
        // always the rendition rule - the place came from this media's own chain,
        // so "not at this place" cannot arise
        if (error instanceof ApiError && error.status === 400) {
            return "This media has no rendition that may be published. Originals never are.";
        }

        return describeError(error);
    };

    return (
        <Switch fallback={<Loading />}>
            <Match when={places.isError}>
                <ErrorMessage
                    title="Could not load this photo's places"
                    error={places.error}
                    onRetry={() => void places.refetch()}
                />
            </Match>

            <Match when={places.isSuccess}>
                <Show
                    when={places.data!.length > 0}
                    fallback={
                        <p class="text-sm">
                            This media has no location the geocoder recognised, so there is nowhere
                            to publish it as a cover.
                        </p>
                    }
                >
                    <div class="flex flex-col gap-2">
                        <For each={places.data}>
                            {place => (
                                <div class="flex items-center gap-2">
                                    <Show
                                        when={place.coverUrl}
                                        fallback={
                                            <div class="flex items-center justify-center w-24 aspect-4/3 shrink-0 rounded-sm bg-base-200 text-base-content/40">
                                                <Icon classes="icon-[ic--round-add-photo-alternate] text-xl" />
                                            </div>
                                        }
                                    >
                                        <img
                                            src={place.coverUrl!}
                                            alt={`Cover of ${place.name}`}
                                            class="w-24 aspect-4/3 shrink-0 object-cover rounded-sm"
                                        />
                                    </Show>

                                    <div class="min-w-0 grow">
                                        <div class="truncate text-sm font-bold">{place.name}</div>
                                        <div class="truncate text-xs opacity-70">
                                            {getPlaceKindName(place.kind)}
                                        </div>

                                        <Show
                                            when={!isCurrent(place)}
                                            fallback={
                                                <p class="text-xs text-primary mt-1">
                                                    <Icon classes="icon-[ic--round-check] mr-1" />
                                                    This photo is the cover
                                                </p>
                                            }
                                        >
                                            <button
                                                class="btn btn-outline btn-primary btn-xs mt-1"
                                                disabled={setCoverMutation.isPending}
                                                onClick={() => replace(place)}
                                            >
                                                {place.coverUrl ? "Replace" : "Set"} with Active
                                                Photo
                                            </button>
                                        </Show>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>

                    <Show when={errorMessage()}>
                        <p class="text-sm text-error mt-2">{errorMessage()}</p>
                    </Show>
                </Show>
            </Match>
        </Switch>
    );
};

export default PlaceCoversCard;
