import { describe, expect, test } from "vitest";

import {
    ThemeDark,
    ThemeIdType,
    ThemeLight,
    ThemeSystem,
    getToggledTheme,
    resolveTheme
} from "./Theme";

const allChoices: ThemeIdType[] = [ThemeLight, ThemeDark, ThemeSystem];

describe("resolving a theme", () => {
    test("an explicit choice is honoured whatever the system says", () => {
        expect(resolveTheme(ThemeLight, true)).toBe(ThemeLight);
        expect(resolveTheme(ThemeDark, false)).toBe(ThemeDark);
    });

    test("system follows the system", () => {
        expect(resolveTheme(ThemeSystem, true)).toBe(ThemeDark);
        expect(resolveTheme(ThemeSystem, false)).toBe(ThemeLight);
    });
});

/*
   The property that matters, and the one the first attempt at this got wrong.

   The toggle used to cycle light -> dark -> system -> light. `system` renders as
   one of the other two, so on a dark desktop that reads as dark, dark, light:
   one press in three appears to do nothing. Reported as "I have to click twice
   to get to light mode".

   Whatever you are looking at, and whatever the desktop is set to, a press has
   to change what is on screen.
*/
describe("toggling the theme", () => {
    test.each([
        [true, "a dark desktop"],
        [false, "a light desktop"]
    ])("always changes what is rendered, on %s", systemPrefersDark => {
        for (const choice of allChoices) {
            const before = resolveTheme(choice, systemPrefersDark);
            const after = resolveTheme(getToggledTheme(before), systemPrefersDark);

            expect(after, `toggling from ${choice} did nothing`).not.toBe(before);
        }
    });

    test("lands on an explicit choice, never back on system", () => {
        expect(getToggledTheme(ThemeDark)).toBe(ThemeLight);
        expect(getToggledTheme(ThemeLight)).toBe(ThemeDark);
    });
});
