import { Component, Show, createEffect, createSignal, onCleanup } from "solid-js";

import { useScrollContainer } from "../layout/ScrollContainerContext";

import Loading from "../loading/Loading";

// a screen's warning, so a normal scroll rarely reaches the end first. A share of
// the scroller rather than pixels: a page of tiles is shorter than a tall screen,
// and a fixed distance had a list fetch several pages before anyone scrolled at all
const NEAR_END_MARGIN = "0px 0px 100% 0px";

interface Props {
    hasMore: boolean;
    isLoading: boolean;
    // the last attempt failed, which waits for a click rather than trying again
    failed: boolean;
    onLoad: () => void;
}

/*
   Goes after a list that arrives a page at a time, and asks for the next page as
   its end approaches.

   Whether the end is near is held as state rather than acted on as an event. An
   observer only reports a change, so a page too short to push this off screen
   would never report again and the list would stop there. As state, each finished
   page is another chance to ask, until the screen is full or nothing is left.

   A failure stops it, because being near the end is still true: asking again would
   go on for as long as the server kept failing. What is already listed stays.
*/
const LoadMore: Component<Props> = props => {
    const scroller = useScrollContainer();
    const [marker, setMarker] = createSignal<HTMLElement>();
    const [isNearEnd, setIsNearEnd] = createSignal(false);

    createEffect(() => {
        const element = marker();

        // absent in jsdom, where nothing is laid out to be near anything
        if (!element || typeof IntersectionObserver === "undefined") {
            return;
        }

        const observer = new IntersectionObserver(
            entries => setIsNearEnd(entries.some(entry => entry.isIntersecting)),
            { root: scroller?.() ?? null, rootMargin: NEAR_END_MARGIN }
        );

        observer.observe(element);
        onCleanup(() => observer.disconnect());
    });

    createEffect(() => {
        if (isNearEnd() && props.hasMore && !props.isLoading && !props.failed) {
            props.onLoad();
        }
    });

    return (
        <>
            <Show when={props.failed}>
                <div class="my-4 flex items-center justify-center gap-3 text-sm" role="alert">
                    <span class="text-error">Could not load more.</span>

                    <button
                        type="button"
                        class="btn btn-sm btn-outline"
                        onClick={() => props.onLoad()}
                    >
                        Retry
                    </button>
                </div>
            </Show>

            <Show when={props.isLoading}>
                <Loading />
            </Show>

            <div ref={setMarker} aria-hidden="true" class="h-px" />
        </>
    );
};

export default LoadMore;
