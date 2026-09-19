import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import IconButton from "./IconButton";

afterEach(cleanup);

/*
   The heart on an open photograph sits inside the link that closes it. A click
   on the heart has to favourite and stop there - reaching the link would shut
   the photograph the reader just liked. Both ways of drawing the button, since
   the styled tooltip puts Kobalte's handlers between the click and this one.
*/
describe.each([
    ["with the browser's title", false],
    ["with the styled tooltip", true]
])("a click on the heart %s", (_, styledTooltip) => {
    test("favourites, and goes no further", () => {
        const favourited = vi.fn();
        const closed = vi.fn();

        render(() => (
            <a href="/grid" onClick={closed}>
                <IconButton
                    label="Add to favourites"
                    styledTooltip={styledTooltip}
                    onClick={favourited}
                />
            </a>
        ));

        const click = new MouseEvent("click", { bubbles: true, cancelable: true });

        fireEvent(screen.getByRole("button", { name: "Add to favourites" }), click);

        expect(favourited).toHaveBeenCalledOnce();
        expect(closed).not.toHaveBeenCalled();
        expect(click.defaultPrevented).toBe(true);
    });
});
