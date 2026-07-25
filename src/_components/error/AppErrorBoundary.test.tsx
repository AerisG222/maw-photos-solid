import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";

import { ApiError } from "../../_contexts/api/ApiError";

import AppErrorBoundary from "./AppErrorBoundary";

const Boom = (): never => {
    throw new ApiError(500, "Server Error", "categories/years");
};

describe("AppErrorBoundary", () => {
    it("renders children when nothing throws", () => {
        const { getByText, unmount } = render(() => (
            <AppErrorBoundary>
                <p>all good</p>
            </AppErrorBoundary>
        ));

        expect(getByText("all good")).toBeTruthy();
        unmount();
    });

    it("catches a throw from a child component and shows the message", () => {
        // solid logs the caught error; keep the test output readable
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const { getByText, queryByText, unmount } = render(() => (
            <AppErrorBoundary title="This page could not be displayed">
                <Boom />
            </AppErrorBoundary>
        ));

        expect(getByText("This page could not be displayed")).toBeTruthy();
        // the 500 is described in human terms, not dumped raw
        expect(getByText(/temporary/i)).toBeTruthy();
        expect(queryByText(/Server Error/)).toBeNull();

        unmount();
        consoleError.mockRestore();
    });

    it("offers a way forward rather than a dead end", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const { getByRole, unmount } = render(() => (
            <AppErrorBoundary>
                <Boom />
            </AppErrorBoundary>
        ));

        expect(getByRole("button")).toBeTruthy();

        unmount();
        consoleError.mockRestore();
    });
});
