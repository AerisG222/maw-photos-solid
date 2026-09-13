import { JSXElement, ParentComponent, Show } from "solid-js";
import { A } from "@solidjs/router";

import { getGridThumbnailSize } from "../../_models/Density";
import { getThumbnailSize } from "../../_models/ThumbnailSize";
import { useListingSettingsContext } from "../../_contexts/settings/ListingSettingsContext";
import { createImageReveal } from "../loading/_imageReveal";

export interface TileBadges {
    topLeft?: JSXElement;
    topRight?: JSXElement;
    bottomLeft?: JSXElement;
    bottomRight?: JSXElement;
}

interface Props {
    href: string;
    // absent where there is nothing published yet - a person with no face crop
    src: string | undefined;
    alt?: string;
    // a face is square; everything else takes the density's rectangle
    square?: boolean;
    /*
       Card chrome - a surface, a border, a hover lift. Categories and people are
       cards with a name under them; a media tile is the photograph and nothing
       else, so it sits on the page rather than on a card.
    */
    surface?: boolean;
    // shown in place of the image where there is none
    placeholder?: JSXElement;
    // above the picture, for a category's year
    header?: JSXElement;
    // below it, for a title or a name
    label?: JSXElement;
    badges?: TileBadges;
    selected?: boolean;
    eager: boolean;
    title?: string;
    onClick?: (evt: MouseEvent) => void;
}

/*
   One item in a listing.

   The category, person and media tiles were three components which had each
   arrived at the same thing: a link wrapping a two-by-two box, an image that
   fades in once and is desaturated until hovered, badges pinned to the corners,
   and an optional line of text. Around ninety lines apiece, three times over,
   and they had already drifted - different rounding, different transitions,
   different ways of spelling the same hover.

   It sizes itself. Which is the point of it being here rather than in each
   listing: the size comes from the density in the one settings store, so a tile
   no longer has to be told how big it is by whichever screen happens to be
   drawing it.

   Places are deliberately not here. A place card is a different thing - a fixed
   width, a four-by-three cover and a footer of text - and forcing it into this
   shape would mean a prop for every way it differs.
*/
const Tile: ParentComponent<Props> = props => {
    const [listing] = useListingSettingsContext();

    const size = () => getThumbnailSize(getGridThumbnailSize(listing.density));
    const width = () => size().width;
    // a face crop is square, so its height follows its width rather than the ratio
    const height = () => (props.square ? size().width : size().height);

    const { loaded, reveal, ref: imgRef } = createImageReveal(() => props.src);

    return (
        <A
            href={props.href}
            onClick={evt => props.onClick?.(evt)}
            title={props.title}
            class="group grid shrink-0 cursor-pointer overflow-hidden rounded-sm elev-hover"
            classList={{
                "border bg-base-200 hover:bg-base-300 hover:border-primary hover:text-primary":
                    !!props.surface,
                "border-secondary/20": !!props.surface && !props.selected,
                "border-primary bg-primary/10": !!props.selected,
                "border border-transparent hover:border-primary": !props.surface
            }}
        >
            {props.header}

            {/* two by two, so a badge can be pinned to any corner of the picture */}
            <div
                class="inline-grid grid-cols-2 grid-rows-2 overflow-hidden"
                style={{ width: `${width()}px`, height: `${height()}px` }}
            >
                <Show when={props.src} fallback={props.placeholder}>
                    <img
                        ref={imgRef}
                        src={props.src}
                        alt={props.alt ?? ""}
                        class="col-span-full row-span-full block h-full w-full max-w-none object-cover transition-[filter,opacity] duration-[400ms] ease-out"
                        classList={{
                            // no hover zoom: the thumbnail is served at exactly
                            // the size it is drawn, so scaling it up resamples a
                            // source with no spare pixels and the browser
                            // interpolates the composited layer while the
                            // transform runs - it reads as a blur that sharpens
                            // once the transition settles
                            "saturate-50 group-hover:saturate-100": listing.dimThumbnails,
                            "opacity-0": !loaded(),
                            "opacity-100": loaded()
                        }}
                        loading={props.eager ? "eager" : "lazy"}
                        onLoad={reveal}
                        // never leave a failed load as an invisible gap
                        onError={reveal}
                    />
                </Show>

                <Show when={props.badges?.topLeft}>
                    <div class="col-start-1 row-start-1 z-10 justify-self-start self-start">
                        {props.badges?.topLeft}
                    </div>
                </Show>

                <Show when={props.badges?.topRight}>
                    <div class="col-start-2 row-start-1 z-10 justify-self-end self-start">
                        {props.badges?.topRight}
                    </div>
                </Show>

                <Show when={props.badges?.bottomLeft}>
                    <div class="col-start-1 row-start-2 z-10 justify-self-start self-end">
                        {props.badges?.bottomLeft}
                    </div>
                </Show>

                <Show when={props.badges?.bottomRight}>
                    <div class="col-start-2 row-start-2 z-10 justify-self-end self-end">
                        {props.badges?.bottomRight}
                    </div>
                </Show>
            </div>

            <Show when={props.label}>
                <div class="truncate px-1 text-center" style={{ "max-width": `${width()}px` }}>
                    {props.label}
                </div>
            </Show>
        </A>
    );
};

export default Tile;
