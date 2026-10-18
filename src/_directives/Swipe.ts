import { Accessor, onCleanup } from "solid-js";

import { Position, touchPosition } from "./_position";

export const SWIPE_LEFT = "swipe_left";
export const SWIPE_RIGHT = "swipe_right";
export const SWIPE_UP = "swipe_up";
export const SWIPE_DOWN = "swipe_down";
export type SWIPE_DIRECTION =
    typeof SWIPE_LEFT | typeof SWIPE_RIGHT | typeof SWIPE_DOWN | typeof SWIPE_UP;

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            // use:model
            swipe: (direction: SWIPE_DIRECTION) => void;
        }
    }
}

// inspiration: https://stackoverflow.com/a/69617795
export const swipe = (
    el: HTMLElement,
    accessor: Accessor<(direction: SWIPE_DIRECTION) => void>
) => {
    const THRESHOLD = 50;
    let start: Position | undefined;

    const onTouchStart = (evt: TouchEvent) => (start = touchPosition(evt));

    const onDragStart = (evt: DragEvent) =>
        (start = {
            x: evt.screenX,
            y: evt.screenY
        });

    const onTouchEnd = (evt: TouchEvent) => checkSwipe(touchPosition(evt));

    const onDragEnd = (evt: DragEvent) =>
        checkSwipe({
            x: evt.screenX,
            y: evt.screenY
        });

    const checkSwipe = (end: Position | undefined) => {
        if (!start || !end) {
            return;
        }

        const horizontalDifference = end.x - start.x;
        const verticalDifference = end.y - start.y;
        let direction: SWIPE_DIRECTION | undefined = undefined;

        // Horizontal difference dominates
        if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
            if (horizontalDifference >= THRESHOLD) {
                direction = SWIPE_LEFT;
            } else if (horizontalDifference <= -THRESHOLD) {
                direction = SWIPE_RIGHT;
            }
        } else {
            if (verticalDifference >= THRESHOLD) {
                direction = SWIPE_UP;
            } else if (verticalDifference <= -THRESHOLD) {
                direction = SWIPE_DOWN;
            }
        }

        if (direction) {
            accessor?.()(direction);
        }
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("dragend", onDragEnd);

    onCleanup(() => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchend", onTouchEnd);

        el.removeEventListener("dragstart", onDragStart);
        el.removeEventListener("dragend", onDragEnd);
    });
};
