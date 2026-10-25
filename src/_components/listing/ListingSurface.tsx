import { For, JSX, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { createVirtualizer } from "@tanstack/solid-virtual";

import {
    currentScrollOffset,
    useScrollContainer,
    useScrollElement
} from "../layout/ScrollContainerContext";
import { chunkIntoRows, columnsFor } from "./_rows";
import { createScrollMargin } from "./_scrollMargin";

/*
   Enough rows to cover a tall screen before anything is measured, and enough
   spare above and below that scrolling never reaches an unrendered row first.
*/
const ESTIMATED_ROW_HEIGHT = 190;
const OVERSCAN_ROWS = 2;

interface Props<T> {
    items: T[];
    /*
       Given a plain index rather than an accessor, deliberately. The only thing
       any caller does with it is decide whether to load eagerly, which is a
       question about the first render and not one whose answer should follow an
       item as the list reorders around it.
    */
    children: (item: T, index: number) => JSX.Element;
    // the drawn width of one item - places use a wider card than everything else
    itemWidth?: number;
    // the entrance animation, which a skeleton or a nested picker does not want
    animate?: boolean;
    /*
       Inside another windowed listing - each category's photos while browsing
       them all. A virtualiser shifts the page when something above the screen
       turns out a different size than it guessed; the outer listing already
       does that for the whole category, so this one doing it as well moved the
       page twice for the one change.
    */
    nested?: boolean;
    class?: string;
}

/*
   The box a listing's items sit in, and only the part of it you can see.

   Twelve places wrote out the same centered, wrapping flex row for themselves,
   which is the sort of duplication that is harmless right up until somebody
   wants to change how a listing behaves - and then has to find all twelve. This
   is that box; the flow itself is `.listing-flow`, shared with the handful of
   places that want the arrangement without the windowing.

   It is also where the items stopped all being in the document at once. Nothing
   here was virtualised: a people listing built every person, a category built
   every photograph, and a phone-width grid of a few hundred ran to tens of
   thousands of pixels of real DOM. Rows are drawn as they come into view now.

   **Rows, not items.** The tiles wrap, so the unit that scrolls past is a row of
   them, and how many fit is a function of the width available - measured rather
   than assumed, because that is the only honest answer when a panel can open
   beside the listing and take 500px of it away.

   The fixed tile size is what makes any of this possible. While a density
   setting could change it, "how many fit across" had no stable answer and the
   row heights moved underneath the measurement. Deleting that setting was not
   done for this, and paid for it anyway.
*/
const ListingSurface = <T,>(props: Props<T>) => {
    const scrollContainer = useScrollContainer();
    const scrollElement = useScrollElement();
    const [width, setWidth] = createSignal(0);
    const [element, setElement] = createSignal<HTMLDivElement>();
    const scrollMargin = createScrollMargin(element, () => scrollContainer?.());

    const columns = createMemo(() => columnsFor(width(), props.itemWidth));
    const rows = createMemo(() => chunkIntoRows(props.items, columns()));

    const virtualizer = createVirtualizer({
        get count() {
            return rows().length;
        },
        get scrollMargin() {
            return scrollMargin();
        },
        getScrollElement: scrollElement,
        initialOffset: currentScrollOffset(scrollElement),
        // read once: a listing does not move in or out of another, and left unset the
        // virtualiser keeps its own rule rather than one written here to match it
        // eslint-disable-next-line solid/reactivity
        ...(props.nested ? { shouldAdjustScrollPositionOnItemSizeChange: () => false } : {}),
        estimateSize: () => ESTIMATED_ROW_HEIGHT,
        overscan: OVERSCAN_ROWS
    });

    /*
       Everything, when there is nothing to scroll inside, or no way to measure.

       No `Layout` above means no scroll container to measure against - which is
       every test that renders a listing on its own. And jsdom has no
       ResizeObserver, so a page rendered in a test would never learn its width.
       Drawing the lot is what this did before and is right for a handful of
       items.

       Not while the width is still on its way, though. That used to draw
       everything for the first frame and only then window it - every photo of
       a large category, every image fetching, before most were thrown away.
       The rows wait for the width instead.
    */
    const isVirtual = () => !!scrollContainer?.() && typeof ResizeObserver !== "undefined";

    createEffect(() => {
        /*
           Absent in jsdom, and the listing has to survive that rather than
           throw: an unmeasured surface reports no width, which falls through to
           drawing everything - the same answer it gives inside a dialog.
        */
        const container = element();

        if (!container || typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(entries => {
            setWidth(entries[0]?.contentRect.width ?? 0);
        });

        observer.observe(container);
        onCleanup(() => observer.disconnect());
    });

    return (
        <div ref={setElement} class={props.class} classList={{ "rise-in": !!props.animate }}>
            <Show
                when={isVirtual()}
                fallback={
                    <div class="listing-flow">
                        {/* eslint-disable-next-line solid/reactivity -- the index is a number by design, see Props */}
                        <For each={props.items}>{(item, i) => props.children(item, i())}</For>
                    </div>
                }
            >
                <div class="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
                    {/* until the width is in, how many fit across is unknown - see isVirtual */}
                    <For each={width() > 0 ? virtualizer.getVirtualItems() : []}>
                        {virtualRow => (
                            <div
                                /*
                                   Measured rather than trusted: a row of
                                   category cards is taller than a row of
                                   photographs, and a label that wraps is taller
                                   again.
                                */
                                ref={element =>
                                    queueMicrotask(() => virtualizer.measureElement(element))
                                }
                                data-index={virtualRow.index}
                                /*
                                   The space below each row is padding of its
                                   own. Wrapped in one box, the flow's gap set
                                   the rows apart; drawn as separate rows, one
                                   placed directly under the last, nothing did.
                                   Padding is measured with the row, so the
                                   virtualiser places the next one after it.
                                */
                                class="listing-flow absolute top-0 left-0 w-full pb-2"
                                // `start` counts from the top of the scroller; the row is placed within this listing
                                style={{
                                    transform: `translateY(${virtualRow.start - scrollMargin()}px)`
                                }}
                            >
                                {/*
                                    Keyed by the items, so a change to one -
                                    favoriting it - rebuilds that tile alone.
                                    The index is its place in the whole
                                    listing, read once: see Props.
                                */}
                                <For each={rows()[virtualRow.index]}>
                                    {(item, i) =>
                                        // eslint-disable-next-line solid/reactivity -- the index is a number by design, see Props
                                        props.children(item, virtualRow.index * columns() + i())
                                    }
                                </For>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
};

export default ListingSurface;
