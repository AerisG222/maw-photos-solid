import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/*
   Entrance animations must not keep filling after they end.

   `animation-fill-mode: forwards` (or `both`, which includes it) pins the
   animated properties on the element indefinitely. Where those properties are
   `opacity` and `transform`, Chrome keeps the element on its own composited
   layer for the life of the page - and `.rise-in` is on the *listing*, which at
   phone width is tens of thousands of pixels tall. Every hover shadow inside it
   then re-rasters a slice of that layer.

   Measured, with a listing of 1500 tiles at 390px: ~87ms of main-thread work
   per mouse move with `both`, ~6ms with `backwards`. It reads as the browser
   itself going slow, which is how it was reported, and nothing else in the
   suite could see it - it is a fill mode, not markup and not behavior.

   A string check, and honestly a blunt one. It is here because the cost is
   invisible at review time and severe at runtime.
*/
const css = readFileSync("src/index.css", "utf-8");

const animationFor = (utility: string) => {
    const block = new RegExp(`\\.${utility}\\s*\\{([^}]*)\\}`).exec(css);

    expect(block, `no .${utility} rule found`).toBeTruthy();

    return /animation:\s*([^;]+);/.exec(block![1])?.[1] ?? "";
};

describe("entrance animations", () => {
    test("the listing entrance does not fill forwards", () => {
        const animation = animationFor("rise-in");

        expect(animation).toContain("maw-rise-in");
        expect(animation).not.toMatch(/\bboth\b/);
        expect(animation).not.toMatch(/\bforwards\b/);
    });

    /*
       `backwards` is the half that does the work: it holds the `from` state
       ahead of the start. The `to` state is `opacity: 1; transform: none`,
       which is what the element computes to anyway, so filling forwards was
       only ever buying a permanent layer.
    */
    test("but it does hold its starting state", () => {
        expect(animationFor("rise-in")).toMatch(/\bbackwards\b/);
    });

    /*
       The blanket reduced-motion rule caps animations at one iteration of
       0.01ms, which is not enough for the skeletons. Their shimmer moves a
       `background-position` across a gradient that is transparent at both ends;
       capped, it still runs, and with no fill mode it lands back at the
       element's own `0% 0%` - parking a bright band across every placeholder
       and leaving it there. A frozen highlight reads as a rendering fault
       rather than as something loading.
    */
    test("the skeleton shimmer becomes a flat tint, not a frozen band", () => {
        const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
        const rule = /\.skeleton-tile\s*\{([^}]*)\}/.exec(reduced);

        expect(rule, "reduced motion does not neutralise .skeleton-tile").toBeTruthy();
        expect(rule![1]).toMatch(/background-image:\s*none/);
        expect(rule![1]).toMatch(/animation:\s*none/);
    });

    /*
       Hover eases in and snaps out.

       A transition is governed by the state being moved *to*, so declaring it
       on `:hover` rather than on the element gives arrival an animation and
       departure none. That asymmetry is not a flourish: at 200ms in both
       directions, sweeping a pointer across a grid left five cards lit at once,
       measured - a comet-tail that reads as one highlight failing to keep up
       rather than as five highlights. Snapping the exit puts it back to one.

       Guarded because it looks like a mistake. The obvious tidy-up is to hoist
       the transition onto the element "where it belongs", and that would
       silently bring the tail back.
    */
    test("the hover lift declares its transition on the hovered state, not the element", () => {
        const block = /\.elev-hover\s*\{([\s\S]*?)\n {4}\}/.exec(css);

        expect(block, "no .elev-hover rule found").toBeTruthy();

        const [base, hovered] = block![1].split("&:hover");

        expect(base).toMatch(/transition-property:\s*none/);
        expect(hovered).toMatch(/transition-duration/);
    });
});
