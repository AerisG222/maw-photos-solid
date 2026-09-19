import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, expect, test } from "vitest";

import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import ThemeSelector from "./ThemeSelector";

afterEach(() => {
    cleanup();
    localStorage.clear();
});

/*
   Collapsed, the "Theme" text is hidden and the icon is all there is - the
   button still has to say what it does, and say the new thing once pressed.
*/
test("collapsed, it is named for where it will take you", () => {
    render(() => (
        <AllSettingsProvider>
            <ThemeSelector showTitle={false} />
        </AllSettingsProvider>
    ));

    const button = screen.getByRole("button", { name: /^Switch to (Light|Dark) Theme$/ });
    const before = button.getAttribute("aria-label");

    fireEvent.click(button);

    expect(button.getAttribute("aria-label")).not.toBe(before);
    expect(button.getAttribute("aria-label")).toMatch(/^Switch to (Light|Dark) Theme$/);
});
