import { Component, Show, createEffect, createSignal } from "solid-js";

import { ApiError, describeError } from "../../_contexts/api/ApiError";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { getParentPlaceKinds, Place, PlaceKindCountry } from "../../_models/Place";

import PlacePicker from "./PlacePicker";

interface Props {
    place: Place | undefined;
    onClose: () => void;
}

/*
   Moves a place under a different parent - the correction for one the geocoder
   filed in the wrong branch.

   Only the levels above the place are offered, which is the rule the API
   enforces, and only a country may go to the root. The aliases the geocoder
   matches on are deliberately left alone by the move: they record what the
   geocoder produces, while the parent records where an admin decided the place
   belongs, and repointing them would quietly recreate the place under the parent
   it was just moved out of.
*/
const PlaceMoveDialog: Component<Props> = props => {
    const { setParentMutation } = usePlacesContext();
    const [dialog, setDialog] = createSignal<HTMLDialogElement>();
    const [parent, setParent] = createSignal<Place>();
    // separate from "no parent picked yet", which cannot be submitted at all
    const [toRoot, setToRoot] = createSignal(false);

    createEffect(() => {
        if (props.place) {
            dialog()?.showModal();
        } else {
            dialog()?.close();
        }
    });

    const close = () => {
        setParent(undefined);
        setToRoot(false);
        setParentMutation.reset();
        props.onClose();
    };

    const canGoToRoot = () => props.place?.kind === PlaceKindCountry;

    const submit = () => {
        const place = props.place;
        const target = parent();

        if (!place || setParentMutation.isPending) {
            return;
        }

        if (toRoot()) {
            setParentMutation.mutate({ placeId: place.id, parentId: null }, { onSuccess: close });
        } else if (target) {
            setParentMutation.mutate(
                { placeId: place.id, parentId: target.id },
                { onSuccess: close }
            );
        }
    };

    const errorMessage = () => {
        const error = setParentMutation.error;

        if (!error) {
            return undefined;
        }

        if (error instanceof ApiError && error.status === 400) {
            return "That place could not be moved there - a parent has to sit above it in the hierarchy, and only a country may sit at the root.";
        }

        return describeError(error);
    };

    return (
        <dialog class="modal" ref={setDialog} onClose={close}>
            <div class="modal-box">
                <h3 class="font-bold text-lg text-secondary">Move {props.place?.name}</h3>

                <p class="text-sm my-3">
                    Pick where <span class="font-bold">{props.place?.name}</span> belongs. Its media
                    and its own children move with it.
                </p>

                <Show when={canGoToRoot()}>
                    <label class="flex items-center gap-2 text-sm mb-2">
                        <input
                            type="checkbox"
                            class="checkbox checkbox-sm"
                            checked={toRoot()}
                            onChange={evt => setToRoot(evt.currentTarget.checked)}
                        />
                        Move to the root of the tree
                    </label>
                </Show>

                <Show when={props.place && !toRoot()}>
                    {/*
                        A country has nowhere else to go, so saying so beats
                        offering an empty picker and leaving the reason to be
                        guessed at.
                    */}
                    <Show
                        when={getParentPlaceKinds(props.place!.kind).length > 0}
                        fallback={
                            <p class="text-sm">
                                A country sits at the root of the tree - there is no level above it
                                to move it under.
                            </p>
                        }
                    >
                        <PlacePicker
                            kinds={getParentPlaceKinds(props.place!.kind)}
                            excludeIds={[props.place!.id]}
                            selected={parent()}
                            onSelect={setParent}
                        />
                    </Show>
                </Show>

                <Show when={errorMessage()}>
                    <p class="text-sm text-error mt-2">{errorMessage()}</p>
                </Show>

                <div class="modal-action">
                    <button class="btn btn-sm" onClick={close}>
                        Cancel
                    </button>
                    <button
                        class="btn btn-sm btn-primary"
                        disabled={(!parent() && !toRoot()) || setParentMutation.isPending}
                        onClick={submit}
                    >
                        Move
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default PlaceMoveDialog;
