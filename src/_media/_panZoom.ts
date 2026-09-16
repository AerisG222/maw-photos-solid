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
export const RESTING_SCALE = 1;

// far enough that a steady hand clicking is never mistaken for a drag, close
// enough that a deliberate drag always is
const DRAG_THRESHOLD_PX = 6;

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

        /*
           No modifier. Requiring one was a mistake: the photograph sits inside
           the link that closes it, so a reader holding ctrl to zoom is one
           stray click away from ctrl-clicking that link - which opens a tab,
           and which the browser reports as a blocked popup. Wheel-to-zoom is
           what every other photograph viewer does anyway.
        */
        const onWheel = (event: WheelEvent) => panzoom.zoomWithWheel(event);

        /*
           A drag is not a click on the thing underneath.

           The photograph is wrapped in a link back to the grid, so without this
           a drag to pan ends by closing the photograph being panned.

           Measured by how far the pointer travelled, rather than by asking
           Panzoom whether it did anything. Its `panzoomzoom` fires on `reset`
           too - which happens on every change of photograph - so a flag set
           from its events was already true before the reader touched anything,
           and ate the first click on every photograph. Distance is what
           actually distinguishes the two gestures, and it answers the same way
           whatever the library does internally.
        */
        let origin: { x: number; y: number } | undefined;

        const onPointerDown = (event: PointerEvent) => {
            origin = { x: event.clientX, y: event.clientY };
        };

        const onClick = (event: MouseEvent) => {
            const start = origin;

            origin = undefined;

            if (!start) {
                return;
            }

            const travelled = Math.hypot(event.clientX - start.x, event.clientY - start.y);

            // a tap still closes the photograph, zoomed in or not
            if (travelled > DRAG_THRESHOLD_PX) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        target.addEventListener("panzoomzoom", onZoom);
        target.addEventListener("wheel", onWheel, { passive: false });
        target.addEventListener("pointerdown", onPointerDown, true);
        target.addEventListener("click", onClick, true);

        onCleanup(() => {
            target.removeEventListener("panzoomzoom", onZoom);
            target.removeEventListener("wheel", onWheel);
            target.removeEventListener("pointerdown", onPointerDown, true);
            target.removeEventListener("click", onClick, true);
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
