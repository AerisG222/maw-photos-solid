import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

import { describePlaceAncestry, getPlaceKindName, Place } from "../../_models/Place";
import { hasRevealed, markRevealed } from "../../_components/loading/_imageReveal";
import { getPlaceAdminPath } from "../_routes";

import Icon from "../../_components/icon/Icon";

interface Props {
    place: Place;
    // where the place sits in the tree, shown while searching - results come from
    // anywhere in it, and two cities can share a name and even a parent
    showAncestry: boolean;
    eager: boolean;
    onChooseCover: (place: Place) => void;
}

/*
   One place in a listing. The tile itself drills in - to the places beneath it,
   and to the panel where this one is administered - so the cover button is the
   only thing on it that does something else.
*/
const PlaceCard: Component<Props> = props => {
    const coverUrl = () => props.place.coverUrl ?? undefined;

    // a cover already seen this session starts visible, so rebuilding the list
    // does not flash every tile back to transparent - see _imageReveal
    const [coverLoaded, setCoverLoaded] = createSignal(hasRevealed(coverUrl()));

    let img: HTMLImageElement | undefined;

    const reveal = () => {
        markRevealed(coverUrl());
        setCoverLoaded(true);
    };

    onMount(() => {
        if (img?.complete) {
            reveal();
        }
    });

    const chooseCover = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();

        props.onChooseCover(props.place);
    };

    return (
        <A
            href={getPlaceAdminPath(props.place.id)}
            class="group flex flex-col w-60 border border-secondary/20 rounded-sm bg-base-200
                hover:bg-base-300 hover:border-primary hover:text-primary
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20
                transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out"
            title={`${props.place.name} (${props.place.mediaCount})`}
        >
            {/* covers are published at 320x240, so the tile is shaped to match */}
            <div class="relative w-full aspect-4/3 overflow-hidden rounded-t-sm bg-base-300">
                <Show
                    when={coverUrl()}
                    fallback={
                        <div class="flex w-full h-full items-center justify-center text-base-content/40">
                            <Icon classes="icon-[ic--round-add-photo-alternate] text-4xl" />
                        </div>
                    }
                >
                    <img
                        ref={img}
                        src={coverUrl()}
                        alt={props.place.name}
                        classList={{
                            block: true,
                            "w-full": true,
                            "h-full": true,
                            "object-cover": true,
                            "transition-opacity": true,
                            "duration-[400ms]": true,
                            "ease-out": true,
                            "opacity-0": !coverLoaded(),
                            "opacity-100": coverLoaded()
                        }}
                        loading={props.eager ? "eager" : "lazy"}
                        onLoad={reveal}
                        // never leave a failed load as an invisible gap
                        onError={reveal}
                    />
                </Show>

                <div class="absolute top-0 left-0 m-0.5 badge badge-sm opacity-70">
                    {getPlaceKindName(props.place.kind)}
                </div>

                <div class="absolute bottom-0 right-0 m-0.5 badge badge-sm opacity-70">
                    {props.place.mediaCount}
                </div>
            </div>

            <div class="flex items-center gap-1 px-2 py-1">
                <div class="min-w-0 grow">
                    <div class="truncate">{props.place.name}</div>

                    <Show when={props.showAncestry && props.place.ancestorNames.length > 0}>
                        <div class="truncate text-xs opacity-70">
                            {describePlaceAncestry(props.place)}
                        </div>
                    </Show>
                </div>

                <button
                    class="btn btn-xs btn-ghost text-primary"
                    title={props.place.coverUrl ? "Replace Cover" : "Choose Cover"}
                    onClick={chooseCover}
                >
                    <Icon classes="icon-[ic--round-photo-camera] text-lg" />
                </button>
            </div>
        </A>
    );
};

export default PlaceCard;
