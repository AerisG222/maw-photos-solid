import { createEffect, createSignal, onCleanup } from "solid-js";
import Panzoom, { PanzoomObject } from "@panzoom/panzoom";

/*
   Pinch, wheel and drag on the open photograph.

   There was none. Fullscreen became a state of the grid rather than a place you
   go, and the thing you most want once a photograph fills the screen is to look
   closer at part of it - on a phone especially, where pinching is what everybody
   tries first.

   **Panning is off until there is something to pan.** At the resting size the
   photograph already fits, so a drag means "next photograph" - the swipe
   directive owns that gesture. Once zoomed in, a drag means "show me the other
   corner", and the swipe would be wrong. The two never compete because the
   condition that enables one disables the other.

   The zoom lives on its own element, above the one carrying rotation and the
   filters: two transforms cannot share a style property, and nesting them
   composes in the order you would expect - the photograph turns, and then the
   whole turned thing is scaled.
*/
const MAX_SCALE = 6;
const RESTING_SCALE = 1;

export const createPanZoom = (element: () => HTMLElement | undefined, subject: () => unknown) => {
    const [scale, setScale] = createSignal(RESTING_SCALE);

    let instance: PanzoomObject | undefined;

    createEffect(() => {
        const target = element();

        if (!target) {
            return;
        }

        const panzoom = Panzoom(target, {
            maxScale: MAX_SCALE,
            minScale: RESTING_SCALE,
            // see above: a drag at the resting size belongs to the swipe
            disablePan: true,
            // the photograph is the whole point; let it reach the edges
            contain: "outside",
            cursor: "default"
        });

        instance = panzoom;

        const onZoom = (event: Event) => {
            const next = (event as CustomEvent<{ scale: number }>).detail.scale;

            setScale(next);
            panzoom.setOptions({ disablePan: next <= RESTING_SCALE });
        };

        const onWheel = (event: WheelEvent) => {
            // plain scrolling still scrolls; zoom is the deliberate gesture
            if (event.ctrlKey || event.metaKey) {
                panzoom.zoomWithWheel(event);
            }
        };

        target.addEventListener("panzoomzoom", onZoom);
        target.addEventListener("wheel", onWheel, { passive: false });

        onCleanup(() => {
            target.removeEventListener("panzoomzoom", onZoom);
            target.removeEventListener("wheel", onWheel);
            panzoom.destroy();
            instance = undefined;
        });
    });

    /*
       Back to the resting size when the photograph changes, for the reason the
       adjustments reset: a zoom belongs to the thing it was applied to, and
       arriving at the next photograph already halfway into its corner is a
       state nobody asked for.
    */
    createEffect(() => {
        subject();
        instance?.reset({ animate: false });
        setScale(RESTING_SCALE);
    });

    return { isZoomed: () => scale() > RESTING_SCALE };
};
