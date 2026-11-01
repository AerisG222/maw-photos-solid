import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import LoadMore from "./LoadMore";

// jsdom lays nothing out, so being near the end is reported by hand
let report: (isIntersecting: boolean) => void;

class FakeIntersectionObserver {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        report = isIntersecting => callback([{ isIntersecting }]);
    }

    observe() {
        /* reported by hand */
    }

    disconnect() {
        /* nothing to stop */
    }
}

const real = globalThis.IntersectionObserver;

beforeAll(() => {
    globalThis.IntersectionObserver =
        FakeIntersectionObserver as unknown as typeof IntersectionObserver;
});

// put back: test files share these globals
afterAll(() => {
    globalThis.IntersectionObserver = real;
});

afterEach(cleanup);

const onLoad = vi.fn();

beforeEach(() => onLoad.mockClear());

const renderLoadMore = () => {
    const [hasMore, setHasMore] = createSignal(true);
    const [isLoading, setIsLoading] = createSignal(false);
    const [failed, setFailed] = createSignal(false);

    render(() => (
        <LoadMore hasMore={hasMore()} isLoading={isLoading()} failed={failed()} onLoad={onLoad} />
    ));

    return { setHasMore, setIsLoading, setFailed };
};

describe("asking for the next page", () => {
    test("waits until the end is near", () => {
        renderLoadMore();

        expect(onLoad).not.toHaveBeenCalled();

        report(true);

        expect(onLoad).toHaveBeenCalledOnce();
    });

    test("does not ask again while a page is on its way", () => {
        const { setIsLoading } = renderLoadMore();

        setIsLoading(true);
        report(true);

        expect(onLoad).not.toHaveBeenCalled();
    });

    // the observer only reports a change, and a short page changes nothing
    test("asks again if the end is still near when a page lands", () => {
        const { setIsLoading } = renderLoadMore();

        report(true);
        setIsLoading(true);
        setIsLoading(false);

        expect(onLoad).toHaveBeenCalledTimes(2);
    });

    test("stops when there is nothing left", () => {
        const { setHasMore } = renderLoadMore();

        setHasMore(false);
        report(true);

        expect(onLoad).not.toHaveBeenCalled();
    });
});

describe("a page that fails", () => {
    test("is not retried on its own, however near the end is", () => {
        const { setFailed, setIsLoading } = renderLoadMore();

        report(true);
        onLoad.mockClear();

        setIsLoading(true);
        setFailed(true);
        setIsLoading(false);

        expect(onLoad).not.toHaveBeenCalled();
    });

    test("offers a retry", () => {
        const { setFailed } = renderLoadMore();

        setFailed(true);
        fireEvent.click(screen.getByRole("button", { name: "Retry" }));

        expect(onLoad).toHaveBeenCalledOnce();
    });
});
