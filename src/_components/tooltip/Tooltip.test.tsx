import { cleanup, fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { afterEach, expect, test, vi } from "vitest";

import Tooltip from "./Tooltip";

afterEach(cleanup);

test("keyboard focus shows the name and the key to press", async () => {
    render(() => (
        <Tooltip as="button" aria-label="Favorite" content="Favorite" shortcutKeys={["h"]}>
            ♥
        </Tooltip>
    ));

    // a keyboard focus, which is the case `title` never covered
    fireEvent.focus(screen.getByRole("button", { name: "Favorite" }));

    const tooltip = await screen.findByRole("tooltip");

    expect(tooltip).toHaveTextContent("Favorite");
    expect(tooltip.querySelector("kbd")).toHaveTextContent("H");
});

test("a click still does what the control does", () => {
    const clicked = vi.fn();

    render(() => (
        <Tooltip as="button" aria-label="Next" content="Next" onClick={clicked}>
            →
        </Tooltip>
    ));

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(clicked).toHaveBeenCalledOnce();
});

test("the shortcut is stated to assistive technology as well as shown", () => {
    render(() => (
        <Tooltip as="button" aria-label="Next" content="Next" shortcutKeys={["ArrowRight"]}>
            →
        </Tooltip>
    ));

    expect(screen.getByRole("button")).toHaveAttribute("aria-keyshortcuts", "ArrowRight");
});

test("the tooltip is a description only where it says more than the name", () => {
    render(() => (
        <>
            <Tooltip as="button" aria-label="Labels" content="Toggle Labels">
                a
            </Tooltip>
            <Tooltip as="button" aria-label="Grid" content="Grid">
                b
            </Tooltip>
        </>
    ));

    expect(screen.getByRole("button", { name: "Labels" })).toHaveAttribute(
        "aria-description",
        "Toggle Labels"
    );
    // repeating the name would only be read out twice
    expect(screen.getByRole("button", { name: "Grid" })).not.toHaveAttribute("aria-description");
});

test("nothing is shown until asked for", async () => {
    render(() => (
        <Tooltip as="button" aria-label="Grid" content="Grid">
            b
        </Tooltip>
    ));

    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
});
