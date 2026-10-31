import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, expect, test, vi } from "vitest";

import Toggle from "./Toggle";

afterEach(cleanup);

/*
   Its name used to be a heading above it, with nothing tying the two together,
   so the switch itself had no name at all.
*/
test("is named by its label, and clicking the label switches it", () => {
    const onChange = vi.fn();

    render(() => (
        <Toggle title="Show Labels" name="labels" isSelected={false} onChange={onChange} />
    ));

    fireEvent.click(screen.getByText("Show Labels"));

    expect(screen.getByRole("checkbox", { name: "Show Labels" })).toBeTruthy();
    expect(onChange).toHaveBeenCalledWith(true);
});
