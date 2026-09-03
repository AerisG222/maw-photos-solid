import { Component, Match, Show, Switch, createEffect, createMemo, createSignal } from "solid-js";

import { ApiError, describeError } from "../../_contexts/api/ApiError";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { newMediaSeed } from "../../_models/utils/MediaUtils";
import { ThumbnailSizeSmall } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Place } from "../../_models/Place";

import CoverCandidateGrid from "./CoverCandidateGrid";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import PlaceCoverCategories from "./PlaceCoverCategories";
import PlaceCoverCategoryMedia from "./PlaceCoverCategoryMedia";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";

interface Props {
    // the place being given a cover, or undefined when the dialog is closed.
    // read live from the cache by the caller, so the choice made here is
    // reflected without this component tracking it separately
    place: Place | undefined;
    onClose: () => void;
}

/*
   How the candidates are being found: the place's whole feed, or the categories
   holding its media.

   Two ways in rather than one, because the feed alone does not scale down to a
   country - the United States holds 84,000 photographs, and no amount of paging
   is a way to find the one that represents it. Remembering the trip is.
*/
type Browsing = "media" | "categories";

/*
   Chooses the photograph that represents a place.

   Whichever way it is found, the candidate comes from a listing the API will
   accept - the place's own media, or a category holding some of it - so there is
   no eligibility rule here to keep in step with the server's.

   Choosing does not close the dialog. Publishing a cover is a judgement call
   made by looking at the result, and the header shows the published copy as soon
   as it exists, so a second try is one click rather than a re-open.
*/
const PlaceCoverDialog: Component<Props> = props => {
    const { placeMediaQuery, setCoverMutation, clearCoverMutation } = usePlacesContext();
    const [dialog, setDialog] = createSignal<HTMLDialogElement>();
    const [browsing, setBrowsing] = createSignal<Browsing>("media");
    const [category, setCategory] = createSignal<Category>();
    const [favoritesOnly, setFavoritesOnly] = createSignal(false);
    // undefined until asked for, so the picker opens on the newest media - which
    // is the right answer for a city, and no answer at all for a country
    const [seed, setSeed] = createSignal<number>();

    const placeId = () => props.place?.id;
    const mediaFilter = () => ({ favoritesOnly: favoritesOnly(), seed: seed() });
    // eslint-disable-next-line solid/reactivity -- both are accessors, and the query re-keys itself when either changes
    const media = placeMediaQuery(placeId, mediaFilter);

    /*
       Guarded on what the element is already doing, unlike the dialogs that open
       over a value they were handed. The place here is re-read from the cache on
       every render, so publishing a cover hands this a new object while the
       dialog is open - and re-opening an open dialog would at best be a no-op
       and at worst move the focus back to the top of it mid-choice.
    */
    createEffect(() => {
        const el = dialog();

        if (!el) {
            return;
        }

        if (props.place && !el.open) {
            el.showModal();
        } else if (!props.place && el.open) {
            el.close();
        }
    });

    const candidates = createMemo(() => {
        const items: Media[] = [];

        for (const page of media.data?.pages ?? []) {
            if (page) {
                items.push(...page.results);
            }
        }

        return items;
    });

    const pending = () => setCoverMutation.isPending || clearCoverMutation.isPending;

    const choose = (item: Media) => {
        const place = props.place;

        if (place && !pending()) {
            setCoverMutation.mutate({ placeId: place.id, mediaId: item.id });
        }
    };

    const clear = () => {
        const place = props.place;

        if (place && !pending()) {
            clearCoverMutation.mutate(place.id);
        }
    };

    // the mutation error belongs to the last attempt, not to the listing being
    // looked at, so moving between them clears it rather than leaving a refusal
    // hanging over an unrelated set of photographs
    const browse = (mode: Browsing) => {
        setCoverMutation.reset();
        setBrowsing(mode);
        setCategory(undefined);
    };

    const close = () => {
        setCoverMutation.reset();
        clearCoverMutation.reset();
        setBrowsing("media");
        setCategory(undefined);
        setFavoritesOnly(false);
        setSeed(undefined);
        props.onClose();
    };

    /*
       Mapped from the status rather than the response body, which the api layer
       does not carry. A 400 here is one of two refusals, both about the
       photograph that was picked, so it is worth saying what they are instead of
       "something went wrong".
    */
    const errorMessage = () => {
        const error = setCoverMutation.error ?? clearCoverMutation.error;

        if (!error) {
            return undefined;
        }

        if (error instanceof ApiError && error.status === 400) {
            return "That media could not be published - it is either not at this place, or has no rendition that may be published. Originals never are.";
        }

        return describeError(error);
    };

    return (
        <dialog class="modal" ref={setDialog} onClose={close}>
            <div class="modal-box max-w-5xl">
                <h3 class="font-bold text-lg text-secondary">
                    Cover for {props.place?.name ?? "this place"}
                </h3>

                <div class="flex flex-wrap items-center gap-3 my-3">
                    <Show
                        when={props.place?.coverUrl}
                        fallback={
                            <div class="flex items-center justify-center w-40 aspect-4/3 rounded-sm bg-base-300 text-base-content/40">
                                <Icon classes="icon-[ic--round-add-photo-alternate] text-3xl" />
                            </div>
                        }
                    >
                        <img
                            src={props.place!.coverUrl!}
                            alt={`Cover of ${props.place!.name}`}
                            class="w-40 aspect-4/3 object-cover rounded-sm"
                        />
                    </Show>

                    <div class="flex flex-col gap-2">
                        <p class="text-sm">
                            The cover is published as a copy anyone signed in can see, whether or
                            not they can reach the photograph it came from.
                        </p>

                        <div class="flex flex-wrap gap-2">
                            <button
                                class="btn btn-sm"
                                classList={{ "btn-active": favoritesOnly() }}
                                onClick={() => setFavoritesOnly(!favoritesOnly())}
                            >
                                <Icon classes="icon-[ic--round-favorite]" />
                                Favorites Only
                            </button>

                            {/*
                                A fresh seed each time, so pressing it again
                                reshuffles rather than replaying the same order.
                                Only the media feed has an order to shuffle - a
                                shuffled list of categories would mean nothing.
                            */}
                            <Show when={browsing() === "media"}>
                                <button
                                    class="btn btn-sm"
                                    classList={{ "btn-active": seed() !== undefined }}
                                    onClick={() => setSeed(newMediaSeed())}
                                >
                                    <Icon classes="icon-[ic--round-shuffle]" />
                                    Shuffle
                                </button>
                            </Show>

                            <button
                                class="btn btn-sm btn-error btn-outline"
                                disabled={!props.place?.coverMediaId || pending()}
                                onClick={clear}
                            >
                                <Icon classes="icon-[ic--round-delete]" />
                                Remove Cover
                            </button>
                        </div>
                    </div>
                </div>

                <div role="tablist" class="tabs tabs-border mb-2">
                    <button
                        role="tab"
                        class="tab"
                        classList={{ "tab-active": browsing() === "media" }}
                        onClick={() => browse("media")}
                    >
                        <Icon classes="icon-[ic--round-photo-library] mr-1" />
                        All Media
                    </button>
                    <button
                        role="tab"
                        class="tab"
                        classList={{ "tab-active": browsing() === "categories" }}
                        onClick={() => browse("categories")}
                    >
                        <Icon classes="icon-[ic--round-collections] mr-1" />
                        By Category
                    </button>
                </div>

                <Show when={errorMessage()}>
                    <p class="text-sm text-error mb-2">{errorMessage()}</p>
                </Show>

                <div class="max-h-[50vh] overflow-y-auto">
                    <Switch>
                        <Match when={browsing() === "categories" && category()}>
                            <PlaceCoverCategoryMedia
                                category={category()!}
                                coverMediaId={props.place?.coverMediaId}
                                disabled={pending()}
                                onChoose={choose}
                                onBack={() => setCategory(undefined)}
                            />
                        </Match>

                        <Match when={browsing() === "categories"}>
                            <PlaceCoverCategories
                                placeId={placeId()}
                                favoritesOnly={favoritesOnly()}
                                onSelect={setCategory}
                            />
                        </Match>

                        <Match when={browsing() === "media"}>
                            <Switch
                                fallback={
                                    <SkeletonGrid thumbnailSize={ThumbnailSizeSmall} count={12} />
                                }
                            >
                                <Match when={media.isError}>
                                    <ErrorMessage
                                        title="Could not load the media at this place"
                                        error={media.error}
                                        onRetry={() => void media.refetch()}
                                    />
                                </Match>

                                <Match when={media.isSuccess}>
                                    <Show
                                        when={candidates().length > 0}
                                        fallback={
                                            <p class="text-center my-8">
                                                {favoritesOnly()
                                                    ? "None of the media here has been marked as a favorite."
                                                    : "There is nothing here to choose from."}
                                            </p>
                                        }
                                    >
                                        <CoverCandidateGrid
                                            items={candidates()}
                                            coverMediaId={props.place?.coverMediaId}
                                            disabled={pending()}
                                            onChoose={choose}
                                        />

                                        <Show when={media.hasNextPage}>
                                            <div class="flex justify-center my-3">
                                                <button
                                                    class="btn btn-sm btn-primary btn-outline"
                                                    disabled={media.isFetchingNextPage}
                                                    onClick={() => void media.fetchNextPage()}
                                                >
                                                    <Icon classes="icon-[ic--round-fast-forward]" />
                                                    Request More
                                                </button>
                                            </div>
                                        </Show>
                                    </Show>
                                </Match>
                            </Switch>
                        </Match>
                    </Switch>
                </div>

                <div class="modal-action">
                    <button class="btn btn-sm" onClick={close}>
                        Done
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default PlaceCoverDialog;
