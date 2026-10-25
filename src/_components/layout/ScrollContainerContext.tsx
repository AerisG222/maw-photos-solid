import { Accessor, createContext, ParentComponent, useContext } from "solid-js";

/*
   Which element a page actually scrolls in.

   `Layout` owns it - the content area, not the window - and a listing deep
   inside needs it to know what is on screen. The alternative is walking up the
   DOM looking for something with `overflow-y: auto`, which works until a
   wrapper is added and then fails silently and invisibly.

   Undefined where there is no Layout above, which is every test that renders a
   listing on its own. A virtualised listing falls back to drawing everything,
   which is what it did before and is right for a handful of items.
*/
const ScrollContainerContext = createContext<Accessor<HTMLElement | undefined>>();

export const ScrollContainerProvider: ParentComponent<{
    element: Accessor<HTMLElement | undefined>;
}> = props => {
    /*
       One accessor for the life of the provider, which reads the prop each time
       it is called. A context value is captured once, so handing over
       `props.element` directly would pin whichever accessor was passed on the
       first render.
    */
    const element = () => props.element();

    return (
        <ScrollContainerContext.Provider value={element}>
            {props.children}
        </ScrollContainerContext.Provider>
    );
};

export const useScrollContainer = () => useContext(ScrollContainerContext);

/*
   The scroller as a virtualiser should be given it: only once it is in the page.

   Solid builds elements by cloning a template, and until one is inserted it
   belongs to the template's document - which has no window. A virtualiser
   handed it then looks for the window to measure with, finds none, and gives
   up; and since every later check sees the same element, it never looks again.
   Nothing drew at all. Held back until it is connected, it is taken up on the
   virtualiser's next look, when the listing mounts.
*/
/*
   Where the page is scrolled to, for a virtualiser to start from.

   A virtualiser writes its idea of the scroll position to the page as it takes
   up the scroller - and it only learns the real one from scroll events, so a
   listing mounting part-way down a page wrote its default, the top. Browsing
   every category's photos mounts a grid for each category as it scrolls into
   view, and each one sent the page back to the top.
*/
export const currentScrollOffset = (scroller: () => HTMLElement | null) => () =>
    scroller()?.scrollTop ?? 0;

export const useScrollElement = () => {
    const scroller = useScrollContainer();

    return () => {
        const element = scroller?.();

        return element?.isConnected ? element : null;
    };
};
