import { For, JSX, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { createVirtualizer } from "@tanstack/solid-virtual";

import { useScrollContainer } from "../layout/ScrollContainerContext";
import { chunkIntoRows, columnsFor } from "./_rows";

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
    let container!: HTMLDivElement;

    const scrollContainer = useScrollContainer();
    const [width, setWidth] = createSignal(0);

    const rows = createMemo(() => chunkIntoRows(props.items, columnsFor(width(), props.itemWidth)));

    createEffect(() => {
        /*
           Absent in jsdom, and the listing has to survive that rather than
           throw: an unmeasured surface reports no width, which falls through to
           drawing everything - the same answer it gives inside a dialog.
        */
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(entries => {
            setWidth(entries[0]?.contentRect.width ?? 0);
        });

        observer.observe(container);
        onCleanup(() => observer.disconnect());
    });

    const virtualizer = createVirtualizer({
        get count() {
            return rows().length;
        },
        getScrollElement: () => scrollContainer?.() ?? null,
        estimateSize: () => ESTIMATED_ROW_HEIGHT,
        overscan: OVERSCAN_ROWS
    });

    /*
       Everything, when there is nothing to scroll inside.

       No `Layout` above means no scroll container to measure against - which is
       every test that renders a listing on its own, and the pickers inside
       dialogs. Drawing the lot is what this did before and is right for a
       handful of items.
    */
    const isVirtual = () => !!scrollContainer?.() && width() > 0;

    return (
        <div ref={container} class={props.class} classList={{ "rise-in": !!props.animate }}>
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
                    <For each={virtualizer.getVirtualItems()}>
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
                                class="listing-flow absolute top-0 left-0 w-full"
                                style={{ transform: `translateY(${virtualRow.start}px)` }}
                            >
                                <For each={rows()[virtualRow.index]}>
                                    {entry => props.children(entry.item, entry.index)}
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
