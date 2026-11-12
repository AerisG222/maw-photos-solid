import { expect, test } from "vitest";

import { isEnterToSubmit } from "./_enterToSubmit";

const key = (init: KeyboardEventInit) =>
    new KeyboardEvent("keydown", { cancelable: true, ...init });

test("Enter acts", () => {
    const evt = key({ key: "Enter", keyCode: 13 });

    expect(isEnterToSubmit(evt)).toBe(true);
    expect(evt.defaultPrevented).toBe(true);
});

test("Enter finishing a word in an input method does not", () => {
    expect(isEnterToSubmit(key({ key: "Enter", isComposing: true }))).toBe(false);
    // Safari, which does not say it is composing
    expect(isEnterToSubmit(key({ key: "Enter", keyCode: 229 }))).toBe(false);
});

test("any other key is left alone", () => {
    const evt = key({ key: "a" });

    expect(isEnterToSubmit(evt)).toBe(false);
    expect(evt.defaultPrevented).toBe(false);
});
