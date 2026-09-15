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
