import { Component, Show } from "solid-js";

import { describePlaceAncestry, getPlaceKindName, Place } from "../../_models/Place";

import Icon from "../../_components/icon/Icon";

interface Props {
    place: Place;
    onChooseCover: () => void;
    onMerge: () => void;
    onMove: () => void;
}

/*
   The place the screen is currently on, and everything that can be done to it.

   It sits above the listing of what is beneath it, so drilling in and
   administering are the same journey - the place you navigated *through* is the
   one you are now able to change.
*/
const PlaceDetail: Component<Props> = props => {
    return (
        <div class="flex flex-wrap items-center gap-4 my-2 p-3 rounded-sm bg-base-200 border border-secondary/20">
            <Show
                when={props.place.coverUrl}
                fallback={
                    <div class="flex items-center justify-center w-48 aspect-4/3 rounded-sm bg-base-300 text-base-content/40">
                        <Icon classes="icon-[ic--round-add-photo-alternate] text-4xl" />
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
                    <button class="btn btn-sm btn-primary" onClick={() => props.onChooseCover()}>
                        <Icon classes="icon-[ic--round-photo-camera]" />
                        {props.place.coverUrl ? "Replace Cover" : "Choose Cover"}
                    </button>

                    <button class="btn btn-sm btn-outline" onClick={() => props.onMove()}>
                        <Icon classes="icon-[ic--round-drive-file-move]" />
                        Move
                    </button>

                    <button class="btn btn-sm btn-outline" onClick={() => props.onMerge()}>
                        <Icon classes="icon-[ic--round-merge-type]" />
                        Merge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetail;
