import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import { shortcutReference } from "./ShortcutReference";

/*
   The reference has to describe this application, not a plan for it.

   A page documenting keys that do nothing is worse than no page, and it is the
   kind of wrong that nobody notices: the letters drift one at a time as
   toolbars are rewritten, and the document that was accurate when it was
   written quietly stops being so. §7 of the redesign proposed reassigning ten
   of them and that reassignment was never carried out - which is exactly how a
   reference written from the plan would have ended up describing keys that
   were never bound.

   So this reads the source. Every letter a component registers must be
   documented, and every letter documented must be one a component registers.
*/
const sourceFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name);

        if (entry.isDirectory()) {
            return sourceFiles(path);
        }

        return entry.name.endsWith(".tsx") && !entry.name.includes(".test.") ? [path] : [];
    });

// only the single letters: the digits are positional and handed out by NavGroup,
// and the arrows and `?` are registered as text rather than as a bound letter
const isLetter = (key: string) => /^[a-z]$/.test(key);

const boundLetters = () => {
    const found = new Set<string>();

    for (const file of sourceFiles("src")) {
        const source = readFileSync(file, "utf-8");

        for (const match of source.matchAll(/shortcutKeys=\{\["([^"]+)"\]\}/g)) {
            if (isLetter(match[1])) {
                found.add(match[1]);
            }
        }
    }

    return found;
};

const documentedLetters = () =>
    new Set(
        shortcutReference
            .flatMap(group => group.entries)
            .flatMap(entry => entry.keys)
            .filter(isLetter)
    );

describe("the shortcut reference", () => {
    test("documents every letter the application binds", () => {
        const missing = [...boundLetters()].filter(key => !documentedLetters().has(key));

        expect(missing).toEqual([]);
    });

    test("and binds every letter it documents", () => {
        const invented = [...documentedLetters()].filter(key => !boundLetters().has(key));

        expect(invented).toEqual([]);
    });

    // the whole point of the rework: one key, one meaning
    test("gives no key two meanings", () => {
        const keys = shortcutReference.flatMap(group => group.entries).flatMap(entry => entry.keys);

        expect(keys.length).toBe(new Set(keys).size);
    });
});
