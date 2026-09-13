import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import ListingSurface from "./ListingSurface";

afterEach(cleanup);

/*
   jsdom lays nothing out, so every element reports offsetTop 0 and the surface
   sees one long row. Stubbing it is what makes the vertical moves testable at
   all - four across, as a real grid would wrap.
*/
const layOutInRowsOf = (perRow: number) => {
    let index = 0;

    Object.defineProperty(HTMLElement.prototype, "offsetTop", {
        configurable: true,
        get(this: HTMLElement) {
            if (!this.dataset.tile) {
                return 0;
            }

            return Math.floor(Number(this.dataset.tile) / perRow);
        }
    });

    return () => index++;
};

const tiles = (count: number) =>
    Array.from({ length: count }, (_, i) => (
        <a href={`/item/${i}`} data-tile={i}>
            item {i}
        </a>
    ));

const surface = (count: number, keyboardCursor = true) => {
    layOutInRowsOf(4);

    const { container } = render(() => (
        <ListingSurface keyboardCursor={keyboardCursor}>{tiles(count)}</ListingSurface>
    ));

    return container.querySelectorAll<HTMLAnchorElement>("a[href]");
};

const press = (from: HTMLElement, key: string) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });

    from.dispatchEvent(event);

    return event;
};

describe("moving through a listing from the keyboard", () => {
    test("the arrows step along a row", () => {
        const items = surface(8);

        items[0].focus();
        press(items[0], "ArrowRight");
        expect(document.activeElement).toBe(items[1]);

        press(items[1], "ArrowLeft");
        expect(document.activeElement).toBe(items[0]);
    });

    test("down and up move by a row, not by one", () => {
        const items = surface(8);

        items[0].focus();
        press(items[0], "ArrowDown");
        expect(document.activeElement).toBe(items[4]);

        press(items[4], "ArrowUp");
        expect(document.activeElement).toBe(items[0]);
    });

    test("home and end reach the ends", () => {
        const items = surface(8);

        items[3].focus();
        press(items[3], "End");
        expect(document.activeElement).toBe(items[7]);

        press(items[7], "Home");
        expect(document.activeElement).toBe(items[0]);
    });

    test("the ends hold rather than wrapping past them", () => {
        const items = surface(8);

        items[0].focus();
        press(items[0], "ArrowLeft");
        expect(document.activeElement).toBe(items[0]);

        items[7].focus();
        press(items[7], "ArrowRight");
        expect(document.activeElement).toBe(items[7]);
    });

    /*
       The arrows are registered globally as shortcuts as well - they step
       through photographs in a media view. A press the surface has acted on must
       not also reach whatever else claims that key.
    */
    test("a press it acts on is stopped, not merely prevented", () => {
        const items = surface(8);
        const onWindow = vi.fn();

        window.addEventListener("keydown", onWindow);

        items[0].focus();
        const event = press(items[0], "ArrowRight");

        expect(event.defaultPrevented).toBe(true);
        expect(onWindow).not.toHaveBeenCalled();

        window.removeEventListener("keydown", onWindow);
    });

    test("a key it does not claim passes straight through", () => {
        const items = surface(8);

        items[0].focus();
        const event = press(items[0], "a");

        expect(event.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(items[0]);
    });

    // the media grids own their arrows already: there they step through photographs
    test("does nothing where the cursor is not asked for", () => {
        const items = surface(8, false);

        items[0].focus();
        const event = press(items[0], "ArrowRight");

        expect(event.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(items[0]);
    });
});
