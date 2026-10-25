import { Component, For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { LinkOptions } from "@tanstack/solid-router";
import { createVirtualizer } from "@tanstack/solid-virtual";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import {
    currentScrollOffset,
    useScrollContainer,
    useScrollElement
} from "../../_components/layout/ScrollContainerContext";
import { createScrollMargin } from "../../_components/listing/_scrollMargin";

import { ScreenTop, nextCategory, previousCategory } from "../_categoryStep";

import BrowseSection from "./BrowseSection";

// a header and a row or two, before a category's photos have been counted
const ESTIMATED_SECTION_HEIGHT = 320;
/*
   One either side. A category drawn off screen still asks for its photos, so
   the overscan is how far ahead of the reader the requests run - and with each
   category's photos windowed, one is enough to scroll into without a gap.
*/
const OVERSCAN_SECTIONS = 1;

interface Props {
    // in the order the grid lists them: newest year first, each year as listed
    categories: Category[];
    mediaLink: (media: Media) => LinkOptions;
    setIsFavorite: (media: Media, isFavorite: boolean) => void;
    // handed the way to step between categories, for the toolbar - see CategoryStepper
    onStepper?: (stepper: CategoryStepper) => void;
}

// moving a whole category at a time, from wherever the reader is - see _categoryStep
export interface CategoryStepper {
    previous: () => void;
    next: () => void;
    hasPrevious: () => boolean;
    hasNext: () => boolean;
}

/*
   Every category's photos, one category after another.

   Windowed by category rather than by row. A category is one box - its
   sticky header and its photos - and the header can only stick for as long as
   the box holding it is on screen, so splitting a category across rows would
   lose that. It also makes the loading fall out of the windowing: a category's
   photos are asked for when its section mounts, which is when it nears the
   screen, so a few hundred categories cost a few requests at a time.

   How tall a category is cannot be known until its photos arrive - a category
   does not say how many it holds - so each starts as an estimate and is
   measured once drawn. One growing above the screen does not move what you are
   looking at: the virtualiser adjusts the scroll by the difference.
*/
const BrowseListing: Component<Props> = props => {
    const scrollContainer = useScrollContainer();
    const scrollElement = useScrollElement();
    const [element, setElement] = createSignal<HTMLDivElement>();
    const scrollMargin = createScrollMargin(element, () => scrollContainer?.());

    const virtualizer = createVirtualizer({
        get count() {
            return props.categories.length;
        },
        get scrollMargin() {
            return scrollMargin();
        },
        // measurements belong to a category, not a position, so a filter change keeps them
        getItemKey: index => props.categories[index]?.id ?? index,
        getScrollElement: scrollElement,
        initialOffset: currentScrollOffset(scrollElement),
        estimateSize: () => ESTIMATED_SECTION_HEIGHT,
        overscan: OVERSCAN_SECTIONS
    });

    // how far the page is scrolled, as a signal - the virtualiser's own is not one
    const [offset, setOffset] = createSignal(0);

    /*
       The scroller itself, not as the virtualiser is handed it. That one is
       held back until the element is in the page, and whether it is in the
       page is not something this effect can be told about - so asked here, it
       answered "none" once and was never asked again. The listener was never
       added, the offset stayed at the top, and the category steppers thought
       the reader never moved: next went to the second category every time,
       and previous had nowhere to go. Listening needs no window.
    */
    createEffect(() => {
        const scroller = scrollContainer?.();

        if (!scroller) {
            return;
        }

        const read = () => setOffset(scroller.scrollTop);

        read();
        scroller.addEventListener("scroll", read, { passive: true });
        onCleanup(() => scroller.removeEventListener("scroll", read));
    });

    // the category whose header is pinned - read again as sizes settle, as well as on scroll
    const screenTop = createMemo<ScreenTop | undefined>(() => {
        const at = offset();

        void virtualizer.getTotalSize();

        const item =
            props.categories.length > 0 ? virtualizer.getVirtualItemForOffset(at) : undefined;

        return item
            ? { index: item.index, start: item.start, offset: at, count: props.categories.length }
            : undefined;
    });

    const goTo = (index: number | undefined) => {
        if (index !== undefined) {
            virtualizer.scrollToIndex(index, { align: "start" });
        }
    };

    // handed over once: the stepper reads everything it needs as it is called
    // eslint-disable-next-line solid/reactivity
    props.onStepper?.({
        previous: () => goTo(previousCategory(screenTop())),
        next: () => goTo(nextCategory(screenTop())),
        hasPrevious: () => previousCategory(screenTop()) !== undefined,
        hasNext: () => nextCategory(screenTop()) !== undefined
    });

    const isFirstOfYear = (index: number) =>
        index === 0 || props.categories[index - 1]?.year !== props.categories[index]?.year;

    return (
        <div
            ref={setElement}
            class="relative w-full"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
            <For each={virtualizer.getVirtualItems()}>
                {virtualRow => (
                    <div
                        // measured rather than trusted: no two categories hold the same number of photos
                        ref={element => queueMicrotask(() => virtualizer.measureElement(element))}
                        data-index={virtualRow.index}
                        /*
                           Placed with `top`, not a transform as the grid's rows
                           are. A sticky header works from where its box is laid
                           out, and a transform moves the box without moving
                           that - every category was laid out at the top of the
                           listing, so each header pinned itself against the
                           wrong place and slid off out of sight.
                        */
                        class="absolute left-0 w-full"
                        style={{ top: `${virtualRow.start - scrollMargin()}px` }}
                    >
                        {/* keyed: a filter change can put a different category at this position */}
                        <Show when={props.categories[virtualRow.index]} keyed>
                            {category => (
                                <BrowseSection
                                    category={category}
                                    showYear={isFirstOfYear(virtualRow.index)}
                                    eager={virtualRow.index === 0}
                                    mediaLink={props.mediaLink}
                                    setIsFavorite={props.setIsFavorite}
                                />
                            )}
                        </Show>
                    </div>
                )}
            </For>
        </div>
    );
};

export default BrowseListing;
