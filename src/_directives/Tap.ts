import { onCleanup } from "solid-js";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            // use:model
            tap: () => void;
        }
    }
}

type Position = { x?: number; y?: number };

export const tap = (el: HTMLElement, accessor) => {
    const THRESHOLD = 5;
    let start: Position;

    const onTouchStart = (evt: TouchEvent) =>
        (start = {
            x: evt.changedTouches[0].screenX,
            y: evt.changedTouches[0].screenY
        });

    const onTouchEnd = (evt: TouchEvent) =>
        checkTouch({
            x: evt.changedTouches[0].screenX,
            y: evt.changedTouches[0].screenY
        });

    const checkTouch = (end: Position) => {
        if (!start || !end) {
            return;
        }

        let horizontalDifference = end.x - start.x;
        let verticalDifference = end.y - start.y;

        if (horizontalDifference <= THRESHOLD && verticalDifference <= THRESHOLD) {
            accessor?.()();
        }
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    onCleanup(() => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchend", onTouchEnd);
    });
};
