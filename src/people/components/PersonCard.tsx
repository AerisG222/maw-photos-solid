import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";

import { Person } from "../../_models/Person";
import { getThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { hasRevealed, markRevealed } from "../../_components/loading/_imageReveal";
import { getPersonPath } from "../_routes";

import Icon from "../../_components/icon/Icon";

interface Props {
    person: Person;
    showName: boolean;
    showMediaCount: boolean;
    thumbnailSize: ThumbnailSizeIdType;
    dimThumbnails: boolean;
    eager: boolean;
}

const PersonCard: Component<Props> = props => {
    // an absolute url under /assets, like every media file - so the service
    // worker attaches the bearer token the crop is protected by, and this stays
    // a plain <img> with no auth handling of its own
    const faceUrl = () => props.person.preferredFaceUrl ?? undefined;

    // face crops are square, so the tile is square too - the thumbnail widths
    // are what the rest of the app sizes cards by, so they set the edge here
    const edge = () => getThumbnailSize(props.thumbnailSize).width;

    // see CategoryCard: a face already seen this session starts visible so a
    // rebuild of the list does not flash every tile back to transparent
    const [faceLoaded, setFaceLoaded] = createSignal(hasRevealed(faceUrl()));

    let img: HTMLImageElement | undefined;

    const reveal = () => {
        markRevealed(faceUrl());
        setFaceLoaded(true);
    };

    onMount(() => {
        if (img?.complete) {
            reveal();
        }
    });

    return (
        <A
            href={getPersonPath(props.person.id)}
            class="grid group border-1 rounded-sm bg-base-200 border-secondary/20 cursor-pointer
                hover:bg-base-300 hover:border-primary hover:text-primary
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20
                transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out"
            title={`${props.person.name} (${props.person.mediaCount})`}
        >
            <div
                classList={{
                    "inline-grid": true,
                    "grid-cols-2": true,
                    "grid-rows-2": true,
                    "overflow-hidden": true,
                    "rounded-t-sm": true,
                    "rounded-b-sm": !props.showName
                }}
                style={{ width: `${edge()}px`, height: `${edge()}px` }}
            >
                <Show
                    when={faceUrl()}
                    fallback={
                        /* nobody has published a preferred face for them yet */
                        <div class="col-span-full row-span-full flex items-center justify-center bg-base-300 text-base-content/40">
                            <Icon classes="icon-[ic--round-person] text-4xl" />
                        </div>
                    }
                >
                    <img
                        ref={img}
                        src={faceUrl()}
                        alt={props.person.name}
                        classList={{
                            "col-span-full": true,
                            "row-span-full": true,
                            block: true,
                            "w-full": true,
                            "h-full": true,
                            "object-cover": true,
                            "saturate-50": props.dimThumbnails,
                            "group-hover:saturate-100": props.dimThumbnails,
                            "rounded-t-sm": true,
                            "rounded-b-sm": !props.showName,
                            "transition-[filter,opacity]": true,
                            "duration-[400ms]": true,
                            "ease-out": true,
                            "opacity-0": !faceLoaded(),
                            "opacity-100": faceLoaded()
                        }}
                        loading={props.eager ? "eager" : "lazy"}
                        onLoad={reveal}
                        // never leave a failed load as an invisible gap
                        onError={reveal}
                    />
                </Show>

                <Show when={props.showMediaCount}>
                    <div class="col-start-2 row-start-2 z-10 justify-self-end self-end badge badge-sm m-[2px] opacity-70">
                        {props.person.mediaCount}
                    </div>
                </Show>
            </div>

            <Show when={props.showName}>
                <div class="text-center truncate px-1" style={{ "max-width": `${edge()}px` }}>
                    {props.person.name}
                </div>
            </Show>
        </A>
    );
};

export default PersonCard;
