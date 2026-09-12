import { render } from "@solidjs/testing-library";
import { JSXElement } from "solid-js";
import { describe, expect, test, vi } from "vitest";

import { RetryableQuery } from "../error/_queryError";

import AsyncBoundary from "./AsyncBoundary";

const query = (over: Partial<RetryableQuery> = {}): RetryableQuery => ({
    isError: false,
    error: null,
    refetch: () => undefined,
    ...over
});

interface Options {
    queries?: RetryableQuery[];
    error?: unknown;
    onRetry?: () => void;
    when?: unknown;
    isEmpty?: boolean;
    empty?: JSXElement;
    children?: JSXElement;
}

/*
   Props are passed one at a time rather than spread. Solid's `mergeProps`
   treats an explicitly-undefined value in a spread as "not given", so a
   `{ when: undefined }` override would silently lose to the default.
*/
const boundary = (options: Options = {}) =>
    render(() => (
        <AsyncBoundary
            queries={options.queries ?? []}
            error={options.error}
            onRetry={options.onRetry}
            errorTitle="Could not load the things"
            when={"when" in options ? options.when : true}
            skeleton={<div>skeleton</div>}
            isEmpty={options.isEmpty}
            empty={options.empty}
        >
            {options.children ?? <div>loaded</div>}
        </AsyncBoundary>
    ));

describe("AsyncBoundary", () => {
    test("shows the skeleton until the data is here", () => {
        const { queryByText } = boundary({ when: undefined });

        expect(queryByText("skeleton")).toBeTruthy();
        expect(queryByText("loaded")).toBeNull();
    });

    test("shows the children once it is", () => {
        const { queryByText } = boundary();

        expect(queryByText("loaded")).toBeTruthy();
        expect(queryByText("skeleton")).toBeNull();
    });

    /*
       The reason the error branch is tested first in the component: a failed
       query leaves its data undefined, which is indistinguishable from
       still-loading. Getting this order wrong leaves a broken screen showing a
       skeleton forever, which is how two of these screens used to behave.
    */
    test("a failure is reported rather than skeletoned forever", () => {
        const { queryByText, getByRole } = boundary({
            when: undefined,
            queries: [query({ isError: true, error: new Error("nope") })]
        });

        expect(queryByText("skeleton")).toBeNull();
        expect(getByRole("alert").textContent).toContain("Could not load the things");
    });

    test("retrying re-runs every query, not just the one that failed", () => {
        const failed = vi.fn();
        const healthy = vi.fn();

        const { getByRole } = boundary({
            queries: [
                query({ isError: true, error: new Error("nope"), refetch: failed }),
                query({ refetch: healthy })
            ]
        });

        getByRole("button").click();

        expect(failed).toHaveBeenCalledOnce();
        expect(healthy).toHaveBeenCalledOnce();
    });

    test("a screen that worked out its own failure can report it directly", () => {
        const onRetry = vi.fn();
        const { getByRole } = boundary({ error: new Error("nope"), onRetry });

        getByRole("button").click();

        expect(onRetry).toHaveBeenCalledOnce();
    });

    test("empty is a state of its own, not an absence of one", () => {
        const { queryByText } = boundary({
            isEmpty: true,
            empty: <div>nothing here</div>
        });

        expect(queryByText("nothing here")).toBeTruthy();
        expect(queryByText("loaded")).toBeNull();
    });

    test("a failure outranks emptiness", () => {
        const { queryByText, getByRole } = boundary({
            isEmpty: true,
            empty: <div>nothing here</div>,
            queries: [query({ isError: true, error: new Error("nope") })]
        });

        expect(queryByText("nothing here")).toBeNull();
        expect(getByRole("alert")).toBeTruthy();
    });

    /*
       The bug this exists for.

       `children()` resolves a slot in the wrapping component's own scope rather
       than where it is rendered, so children that reach into data which has not
       arrived - `Object.keys(data()!)` in the categories grid - ran during the
       loading state and threw. It surfaced as "This page could not be displayed"
       on a cold load, and the repo already warned about exactly this in
       AppErrorBoundary.

       Written as real JSX children rather than passed through the helper: the
       compiler only defers them when they are children, which is the whole
       point being tested.
    */
    test("children do not run while the data is still on its way", () => {
        const reachIntoMissingData = () => {
            throw new TypeError("Cannot convert undefined or null to object");
        };

        expect(() =>
            render(() => (
                <AsyncBoundary
                    queries={[]}
                    errorTitle="Could not load the things"
                    when={undefined}
                    skeleton={<div>skeleton</div>}
                >
                    <div>{reachIntoMissingData()}</div>
                </AsyncBoundary>
            ))
        ).not.toThrow();

        expect(document.body.textContent).toContain("skeleton");
    });

    test("nor while a failure is being reported", () => {
        const reachIntoMissingData = () => {
            throw new TypeError("Cannot convert undefined or null to object");
        };

        expect(() =>
            render(() => (
                <AsyncBoundary
                    queries={[query({ isError: true, error: new Error("nope") })]}
                    errorTitle="Could not load the things"
                    when={undefined}
                    skeleton={<div>skeleton</div>}
                >
                    <div>{reachIntoMissingData()}</div>
                </AsyncBoundary>
            ))
        ).not.toThrow();
    });
});
