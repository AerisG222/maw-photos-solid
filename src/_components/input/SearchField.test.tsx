import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import SearchField from "./SearchField";

afterEach(cleanup);

const renderField = (overrides: { canClear?: boolean; onSubmit?: () => void } = {}) => {
    const onClear = vi.fn();

    render(() => (
        <SearchField
            placeholder="Find"
            value="term"
            canClear={overrides.canClear ?? true}
            onInput={() => undefined}
            onClear={onClear}
            onSubmit={overrides.onSubmit}
        />
    ));

    return { onClear };
};

describe("clearing", () => {
    test("is offered only when there is something to clear", () => {
        renderField({ canClear: false });

        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test("clears, and leaves the box ready for the next term", () => {
        const { onClear } = renderField();

        fireEvent.click(screen.getByRole("button", { name: "Clear" }));

        expect(onClear).toHaveBeenCalledOnce();
        expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Find" }));
    });
});

describe("running it", () => {
    test("a page filtering as it is typed in has no button to press", () => {
        renderField();

        expect(screen.queryByRole("button", { name: "Search" })).toBeNull();
    });

    test("otherwise, the button and Enter both run it", () => {
        const onSubmit = vi.fn();

        renderField({ onSubmit });

        fireEvent.click(screen.getByRole("button", { name: "Search" }));
        fireEvent.keyDown(screen.getByRole("textbox", { name: "Find" }), { key: "Enter" });

        expect(onSubmit).toHaveBeenCalledTimes(2);
    });
});
