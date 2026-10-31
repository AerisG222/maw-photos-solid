import { cleanup, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import { FullscreenProvider } from "../_contexts/FullscreenContext";
import { WithRouter } from "../_router/testing";
import { IMediaService } from "./services/IMediaService";
import { SlideshowService } from "./services/SlideshowService";
import ViewGrid from "./ViewGrid";

/*
   The frame stays up while a grid loads. Gating the whole Layout on loading
   meant the toolbar was removed on the way into every category and drawn again
   when the photos landed - which read as the whole bar flashing.

   What is inside the bar and the rail is theirs to test, and they want half the
   application's contexts, so they are stood in for here.
*/
vi.mock("./Toolbar", () => ({ default: () => <nav data-testid="toolbar" /> }));
vi.mock("../_components/inspector/Inspector", () => ({ default: () => null }));
vi.mock("./usePrefetchNeighbors", () => ({ usePrefetchNeighbors: () => undefined }));
vi.mock("../_contexts/api/MediaContext", () => ({
    useMediaContext: () => ({ setIsFavoriteMutation: {} })
}));

// the stage measures itself to place an open photo, which none of these have
beforeAll(() => {
    globalThis.ResizeObserver = class {
        observe() {
            /* nothing to report */
        }

        unobserve() {
            /* nothing to stop */
        }

        disconnect() {
            /* nothing to stop */
        }
    };
});

// put back: test files share these globals, and a listing behaves differently with one
const realResizeObserver = globalThis.ResizeObserver;

afterAll(() => {
    globalThis.ResizeObserver = realResizeObserver;
});

afterEach(cleanup);

const service = {
    getMediaList: () => [],
    getActiveMedia: () => undefined,
    getActiveCategory: () => undefined,
    getEntryLinkByView: () => ({ href: "/" }),
    getMediaLinkByView: () => ({ href: "/" })
} as unknown as IMediaService;

const slideshow = { stop: () => undefined } as unknown as SlideshowService;

const renderGrid = (state: { isLoading: boolean; loadError?: unknown }) =>
    render(() => (
        <WithRouter>
            <FullscreenProvider>
                <ViewGrid
                    mediaService={service}
                    slideshowService={slideshow}
                    showBreadcrumbsOnGrid={false}
                    showBreadcrumbsOnMedia={false}
                    isLoading={state.isLoading}
                    loadError={state.loadError}
                    emptyState={<p>nothing here</p>}
                />
            </FullscreenProvider>
        </WithRouter>
    ));

describe("a grid that is still loading", () => {
    test("keeps the same toolbar from the first frame to the last", () => {
        const [isLoading, setIsLoading] = createSignal(true);

        renderGrid({
            get isLoading() {
                return isLoading();
            }
        });

        const during = screen.getByTestId("toolbar");

        expect(screen.queryByText("nothing here")).toBeNull();

        setIsLoading(false);

        expect(screen.getByText("nothing here")).toBeTruthy();
        expect(screen.getByTestId("toolbar")).toBe(during);
    });

    test("reports a failure in place of the photos, with the toolbar still there", () => {
        renderGrid({ isLoading: false, loadError: new Error("nope") });

        expect(screen.getByTestId("toolbar")).toBeTruthy();
        expect(screen.queryByText("nothing here")).toBeNull();
    });
});
