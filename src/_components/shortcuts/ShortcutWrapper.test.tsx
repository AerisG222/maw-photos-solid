import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, expect, test, vi } from "vitest";

import { ShortcutProvider } from "../../_contexts/ShortcutContext";

import ShortcutWrapper from "./ShortcutWrapper";

afterEach(() => {
    cleanup();
});

const press = (key: string) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });

    window.dispatchEvent(event);
    window.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }));

    return event;
};

const mount = (clickHandler: () => void) => {
    const { container } = render(() => (
        <ShortcutProvider>
            <ShortcutWrapper name="Titles" shortcutKeys={["t"]} clickHandler={clickHandler}>
                <button>Titles</button>
            </ShortcutWrapper>
            <input type="text" />
        </ShortcutProvider>
    ));

    return container.querySelector("input")!;
};

test("a bound key presses its control", () => {
    const clickHandler = vi.fn();

    mount(clickHandler);

    const event = press("t");

    expect(clickHandler).toHaveBeenCalledOnce();
    // a press that does something cancels the keystroke, so nothing else acts on it
    expect(event.defaultPrevented).toBe(true);
});

/*
   The bug this exists for.

   Declining to *act* while a field has focus was not enough: the keyboard
   primitive cancels the keystroke before it calls back, so a letter bound to a
   toolbar button was swallowed by every text input in the application - you
   could not type a `t` into a clan's name, because `t` toggles titles.

   So both halves matter. The handler must not fire, and the character must
   still reach the field.
*/
test("typing into a field is typing, not a shortcut", () => {
    const clickHandler = vi.fn();
    const input = mount(clickHandler);

    input.focus();

    const event = press("t");

    expect(clickHandler).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
});

test("a disabled control neither acts nor swallows its key", () => {
    const clickHandler = vi.fn();

    render(() => (
        <ShortcutProvider>
            <ShortcutWrapper
                name="Titles"
                shortcutKeys={["t"]}
                disabled={true}
                clickHandler={clickHandler}
            >
                <button>Titles</button>
            </ShortcutWrapper>
        </ShortcutProvider>
    ));

    const event = press("t");

    expect(clickHandler).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
});
