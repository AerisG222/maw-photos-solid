import { vi } from "vitest";

/*
   A viewport of a given width, for the components that ask about one.

   `MediaBreakpointContext` reads `matchMedia`, which jsdom does not implement,
   so anything that changes shape with the width needs it supplied. Four test
   files had written the same stub before this was pulled out - the one that
   parses `min-width: Npx` out of the query and answers by comparison, because
   that is the only form the application asks in.
*/
export const atWidth = (px: number) => {
    vi.stubGlobal("matchMedia", (query: string) => {
        const min = /min-width:\s*(\d+)px/.exec(query);

        return {
            matches: !!min && px >= Number(min[1]),
            media: query,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            addListener: () => undefined,
            removeListener: () => undefined
        };
    });
};
