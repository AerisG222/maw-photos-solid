import { onCleanup } from "solid-js";

export const SWIPE_LEFT = "swipe_left";
export const SWIPE_RIGHT = "swipe_right";
export const SWIPE_UP = "swipe_up";
export const SWIPE_DOWN = "swipe_down";
export type SWIPE_DIRECTION =
    | typeof SWIPE_LEFT
    | typeof SWIPE_RIGHT
    | typeof SWIPE_DOWN
    | typeof SWIPE_UP;

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            // use:model
            swipe: () => void;
        }
    }
}

interface Position {
    x?: number;
    y?: number;
}

// inspiration: https://stackoverflow.com/a/69617795
export const swipe = (el: HTMLElement, accessor) => {
    const THRESHOLD = 50;
    let start: Position;

    const onTouchStart = (evt: TouchEvent) =>
        (start = {
            x: evt.changedTouches[0].screenX,
            y: evt.changedTouches[0].screenY
        });

    const onDragStart = (evt: DragEvent) =>
        (start = {
            x: evt.screenX,
            y: evt.screenY
        });

    const onTouchEnd = (evt: TouchEvent) =>
        checkSwipe({
            x: evt.changedTouches[0].screenX,
            y: evt.changedTouches[0].screenY
        });

    const onDragEnd = (evt: DragEvent) =>
        checkSwipe({
            x: evt.screenX,
            y: evt.screenY
        });

    const checkSwipe = (end: Position) => {
        if (!start || !end) {
            return;
        }

        const horizontalDifference = end.x - start.x;
        const verticalDifference = end.y - start.y;
        let direction = undefined;

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
