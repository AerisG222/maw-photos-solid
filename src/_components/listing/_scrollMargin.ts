import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/*
   How far down the scrolling content a virtualised listing starts.

   The virtualiser measures the scroll offset from the top of the scroller, and
   without being told otherwise takes the listing to start there too. Nothing
   does: there is a filter bar and a heading above every one, and with every
   year shown each year's grid sits below all the years before it - so the later
   grids were drawing rows for a stretch of the page they were nowhere near, and
   scrolling down to one found it mostly blank.

   Measured again whenever the listing or the scroller's content changes size:
   anything above the listing growing - an earlier year's grid arriving, a
   filter bar wrapping - moves where this one starts.
*/
export const createScrollMargin = (
    listing: Accessor<HTMLElement | undefined>,
    scroller: Accessor<HTMLElement | undefined>
) => {
    /*
       Undefined until first measured, and the listing draws no rows until then.
       Taken as 0, every listing on a page believed it started at the top: with
       every year shown that was some twenty-five grids each drawing a screenful
       of cards a frame before learning they were nowhere near the screen - and
       on a return to a position far down the page, each drawing and measuring
       rows around an offset it had wrong.
    */
    const [margin, setMargin] = createSignal<number>();

    createEffect(() => {
        const element = listing();
        const scrolling = scroller();

        // absent in jsdom - a listing measured as starting at the top is still drawn
        if (!element || !scrolling || typeof ResizeObserver === "undefined") {
            return;
        }

        const measure = () => {
            const offset =
                element.getBoundingClientRect().top -
                scrolling.getBoundingClientRect().top +
                scrolling.scrollTop;

            setMargin(Math.max(0, Math.round(offset)));
        };

        const observer = new ResizeObserver(measure);

        observer.observe(element);

        const content = scrolling.firstElementChild;

        if (content) {
            observer.observe(content);
        }

        onCleanup(() => observer.disconnect());
    });

    return margin;
};
