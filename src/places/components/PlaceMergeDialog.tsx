import { Component, Show, createSignal } from "solid-js";

import { ApiError, describeError } from "../../_contexts/api/ApiError";
import { usePlacesContext } from "../../_contexts/api/PlacesContext";
import { Place } from "../../_models/Place";

import Dialog from "../../_components/overlay/Dialog";
import PlacePicker from "./PlacePicker";

interface Props {
    // the survivor. The place picked inside is the one that disappears
    place: Place | undefined;
    onClose: () => void;
}

/*
   Folds a duplicate into this place.

   The more useful of the two corrections, including where a move looks like the
   answer: a town the geocoder filed twice - once with its state and once without
   - is two places, and moving one under the other's parent leaves two of them
   sitting side by side. Merging consolidates them, and the emptied place drops
   out of every listing on its own, because a place with nothing visible in it is
   never listed.

   So the picker is not restricted to a shared parent, only to a shared kind,
   which is the one rule the API enforces.
*/
const PlaceMergeDialog: Component<Props> = props => {
    const { mergePlacesMutation } = usePlacesContext();
    const [source, setSource] = createSignal<Place>();

    const close = () => {
        setSource(undefined);
        mergePlacesMutation.reset();
        props.onClose();
    };

    const submit = () => {
        const place = props.place;
        const from = source();

        if (place && from) {
            mergePlacesMutation.mutate(
                { placeId: place.id, sourceId: from.id },
                { onSuccess: close }
            );
        }
    };

    const errorMessage = () => {
        const error = mergePlacesMutation.error;

        if (!error) {
            return undefined;
        }

        if (error instanceof ApiError && error.status === 400) {
            return "Those places could not be merged - both have to be the same kind, and a place cannot be merged into itself.";
        }

        return describeError(error);
    };

    return (
        <Dialog
            open={!!props.place}
            title={`Merge Into ${props.place?.name ?? ""}`}
            error={errorMessage()}
            onClose={close}
            actions={
                <button
                    class="btn btn-sm btn-error"
                    disabled={!source() || mergePlacesMutation.isPending}
                    onClick={submit}
                >
                    Merge
                </button>
            }
        >
            <p class="text-sm my-3">
                The place picked below is folded into{" "}
                <span class="font-bold">{props.place?.name}</span> and then deleted. Its media, its
                children and the geocoder's names for it all move here, so the next time those
                coordinates are looked up they resolve here too.
            </p>

            <Show when={props.place}>
                <PlacePicker
                    kinds={[props.place!.kind]}
                    excludeIds={[props.place!.id]}
                    selected={source()}
                    onSelect={setSource}
                />
            </Show>

            <Show when={source()}>
                <p class="text-sm mt-3">
                    <span class="font-bold">{source()!.name}</span> will be deleted.
                </p>
            </Show>
        </Dialog>
    );
};

export default PlaceMergeDialog;
