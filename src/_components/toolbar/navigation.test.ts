import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/*
   Navigation stays in the bar; everything else may fold away.

   `ToolbarLayout` puts its children behind a single overflow button below `md`
   and keeps only the `nav` and `actions` slots on screen. That is the right
   trade for a density toggle and the wrong one for the links you move around
   with - so where a toolbar's navigation is passed decides whether you can
   still get anywhere on a phone.

   This exists because the mistake is invisible in review and was made in
   practice: five toolbars were converted to the slot and the sixth was missed,
   so the places screen showed its media/categories switch in the bar while you
   were on media and behind the ellipsis while you were on categories. The same
   control, in two places, depending where you stood.
*/
const NAVIGATION = ["<NavGroup", "<ToolbarListing"];

const sourceFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name);

        if (entry.isDirectory()) {
            return sourceFiles(path);
        }

        return entry.name.endsWith(".tsx") && !entry.name.includes(".test.") ? [path] : [];
    });

/*
   Where the opening `<ToolbarLayout ...>` tag ends.

   Scanned rather than matched with a pattern: the slots hold JSX, so the tag
   contains both `>` and nested braces, and the first `>` is nowhere near the
   end of it. Depth counting is short and it is right.
*/
const endOfOpeningTag = (source: string, from: number) => {
    let depth = 0;

    for (let i = from; i < source.length; i++) {
        const c = source[i];

        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === ">" && depth === 0) return i;
    }

    return -1;
};

const offenders = () =>
    sourceFiles("src").flatMap(file => {
        const source = readFileSync(file, "utf-8");
        const open = source.indexOf("<ToolbarLayout");

        if (open < 0) {
            return [];
        }

        const children = source.slice(endOfOpeningTag(source, open));

        return NAVIGATION.filter(tag => children.includes(tag)).map(
            tag => `${file.replace(/^src\//, "")} passes ${tag.slice(1)} as a child`
        );
    });

describe("where a toolbar puts its navigation", () => {
    test("never in the part that folds into the overflow sheet", () => {
        expect(offenders()).toEqual([]);
    });
});
