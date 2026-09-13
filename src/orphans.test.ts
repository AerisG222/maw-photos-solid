import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { expect, test } from "vitest";

/*
   Nothing in here should be unreachable.

   Deleting the detail view took its toolbar with it, and the toolbar was the
   only thing that rendered the download and share buttons - so four working
   components were left in the tree, importable, tested by nothing, and reachable
   from nowhere. The application quietly lost the ability to download a
   photograph and nobody noticed until the next step went looking for those
   buttons to rehome them.

   A file nobody imports is not always a bug, but it is always worth knowing
   about. This lists them rather than judging them: the allowance below is the
   set that is deliberately reachable another way.
*/
const SRC = join(__dirname);

// entry points and things the bundler or the framework reaches without an import
const ENTRY_POINTS = new Set(["index.tsx", "App.tsx", "routes.ts", "env.d.ts", "vite-env.d.ts"]);

const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap(entry => {
        const full = join(dir, entry);

        return statSync(full).isDirectory() ? walk(full) : [full];
    });

const allFiles = walk(SRC).filter(file => [".ts", ".tsx"].includes(extname(file)));

// a module a test reaches for is reached for; tests are referrers, not candidates
const corpus = allFiles.map(file => ({ file, text: readFileSync(file, "utf-8") }));
const sourceFiles = allFiles.filter(file => !file.includes(".test."));

// `from "./Thing"`, `import("./Thing")`, and the css/asset forms
const isReferenced = (file: string) => {
    const name = basename(file, extname(file));
    const pattern = new RegExp(`["'\`][^"'\`]*/${name}["'\`]|["'\`]\\./${name}["'\`]`);

    return corpus.some(entry => entry.file !== file && pattern.test(entry.text));
};

test("every module is reachable from somewhere", () => {
    const orphans = sourceFiles
        .filter(file => !ENTRY_POINTS.has(basename(file)))
        .filter(file => !isReferenced(file))
        .map(file => relative(SRC, file))
        .sort();

    expect(orphans).toEqual([]);
});
