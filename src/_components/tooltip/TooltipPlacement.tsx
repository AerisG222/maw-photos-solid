import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";

export type Placement = "top" | "bottom" | "left" | "right";

const ATTRIBUTE = "data-tooltip-placement";

/*
   Which way the tooltips in a bar open, written onto the bar itself.

   Every bar in the application turns at the same breakpoint - a column from
   `md` up, a row below it - and a tooltip belongs beside a column but past a
   row: opened along the bar it lands on the neighbouring control. The bar
   knows which edge it is on, so it says so once:

       <div {...barTooltips("right", "top")}>

   and a tooltip looks for the nearest such bar above it in the page as it
   opens.

   Keep that element's `class` on one line. Beside a spread, Solid's compiler
   emits the class as a JavaScript string, and a line break inside it is an
   unterminated string that only the production build reports - the tests and
   the type check both pass.

   An attribute in the page rather than a context, and that is the whole point.
   A context reaches only what is *created* beneath it, and the page toolbars
   resolve their controls in their own bodies before handing them to the bar -
   so Toggle Labels was made outside the bar it sits in, never saw the context,
   and opened below while the view links beside it opened to the side. Where a
   control is drawn is a fact about the page, whoever created it.
*/
export const useBarTooltips = (vertical: Placement, horizontal: Placement) => {
    const [, { gteMd }] = useMediaBreakpointContext();

    return () => ({ [ATTRIBUTE]: gteMd() ? vertical : horizontal });
};

export const placementFromBar = (el: Element | undefined) =>
    el?.closest(`[${ATTRIBUTE}]`)?.getAttribute(ATTRIBUTE) as Placement | null | undefined;
