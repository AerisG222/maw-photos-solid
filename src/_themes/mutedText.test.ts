import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/*
   Text is never faded with opacity.

   Opacity composites text toward whatever is behind it, so a class that reads
   as "slightly quieter" is a contrast failure in disguise: `opacity-70` over
   this application's light foreground lands at **2.81:1**, against the 4.5:1
   body text owes. It was used in a dozen places for captions, ancestry lines
   and media counts, and the theme test could not see it - that test compares
   token against token, and an alpha composite is neither.

   `text-muted` is the replacement, picked per theme to clear 4.5:1 on every
   surface.

   Two things are deliberately not covered. A badge fades its own fill along
   with its text, so the contrast between the two is unchanged. And a disabled
   control is exempt in the guidelines themselves - WCAG excludes inactive
   components from the contrast minimum, and dimming them is how they read as
   unavailable.
*/
// `(?![-\w])` so `text-base` does not match inside `text-base-content`
const TEXT_SIZES = /\b(text-xs|text-sm|text-base|text-lg|text-meta|text-label|text-body)(?![-\w])/;
const FADED = /\bopacity-\d+\b/;

const sourceFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name);

        if (entry.isDirectory()) {
            return sourceFiles(path);
        }

        return entry.name.endsWith(".tsx") && !entry.name.includes(".test.") ? [path] : [];
    });

const offenders = () =>
    sourceFiles("src").flatMap(file => {
        const source = readFileSync(file, "utf-8");

        return [...source.matchAll(/class(?:Name)?="([^"]*)"/g)]
            .map(match => match[1])
            .filter(
                value =>
                    TEXT_SIZES.test(value) &&
                    FADED.test(value) &&
                    // a badge fades its own fill along with its text
                    !value.includes("badge") &&
                    // an inactive control is exempt, and dimming is how it says so
                    !value.includes("disabled") &&
                    !value.includes("cursor-not-allowed")
            )
            .map(value => `${file.replace(/^src\//, "")}: ${value.trim()}`);
    });

describe("secondary text", () => {
    test("is a color, not a faded copy of the foreground", () => {
        expect(offenders()).toEqual([]);
    });
});
