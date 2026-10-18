import { Accessor, onCleanup } from "solid-js";

import { Position, touchPosition } from "./_position";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            // use:model
            tap: () => void;
        }
    }
}

export const tap = (el: HTMLElement, accessor: Accessor<() => void>) => {
    const THRESHOLD = 5;
    let start: Position | undefined;

    const onTouchStart = (evt: TouchEvent) => (start = touchPosition(evt));

    const onTouchEnd = (evt: TouchEvent) => checkTouch(touchPosition(evt));

    const checkTouch = (end: Position | undefined) => {
        if (!start || !end) {
            return;
        }

        const horizontalDifference = end.x - start.x;
        const verticalDifference = end.y - start.y;

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
