import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, expect, test, vi } from "vitest";

import { ShortcutProvider } from "../../_contexts/ShortcutContext";
import FilterMenu from "./FilterMenu";

afterEach(cleanup);

const renderMenu = (activeCount: number, toggleFavorites?: () => void) => {
    const onClear = vi.fn();

    render(() => (
        <ShortcutProvider>
            <FilterMenu
                activeCount={activeCount}
                onClear={onClear}
                toggleFavorites={toggleFavorites}
            >
                <p>an option</p>
            </FilterMenu>
        </ShortcutProvider>
    ));

    return { onClear, trigger: screen.getByRole("button", { name: /Filters/ }) };
};

// a filter goes on hiding things after the menu has closed, so the button has to say so
test("says how many are on while closed, and stands out", () => {
    const { trigger } = renderMenu(2);

    expect(trigger.textContent).toContain("2");
    expect(trigger.classList.contains("btn-primary")).toBe(true);
});

test("says nothing when none are on", () => {
    const { trigger } = renderMenu(0);

    expect(trigger.textContent?.trim()).toBe("Filters");
    expect(trigger.classList.contains("btn-primary")).toBe(false);
});

test("shows its options when opened, and clears them", () => {
    const { onClear, trigger } = renderMenu(1);

    fireEvent.click(trigger);
    expect(screen.getByText("an option")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClear).toHaveBeenCalledOnce();
});

test("clearing is unavailable with nothing to clear", () => {
    const { trigger } = renderMenu(0);

    fireEvent.click(trigger);

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Clear all" }).disabled).toBe(
        true
    );
});
