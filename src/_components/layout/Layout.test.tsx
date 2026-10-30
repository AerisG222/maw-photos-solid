import { cleanup, render, screen } from "@solidjs/testing-library";
import { Show } from "solid-js";
import { afterEach, describe, expect, test } from "vitest";

import { FullscreenProvider } from "../../_contexts/FullscreenContext";
import { useScrollContainer } from "./ScrollContainerContext";
import Layout from "./Layout";

afterEach(cleanup);

describe("a page's content", () => {
    /*
       The listings window themselves against the scroller Layout provides, and
       fall back to drawing every item when they cannot find one. Layout used to
       resolve its content before the provider existed, and a component finds a
       context by where it was made - so none of them ever found it, and no
       listing in the application was ever windowed.
    */
    test("can see the page's scroller", () => {
        let scroller: ReturnType<typeof useScrollContainer>;

        const Listing = () => {
            scroller = useScrollContainer();

            return <p>listing</p>;
        };

        render(() => (
            <FullscreenProvider>
                <Layout>
                    <Listing />
                </Layout>
            </FullscreenProvider>
        ));

        expect(scroller).toBeDefined();
        expect(scroller!()).toBeInstanceOf(HTMLElement);
    });
});

/*
   A person's feed hands in a header for a place to fill: a `Show` holding nothing.
   That is still a value, and wrapped without looking it would pin an empty bar
   across the top of the page, with a border and a blur of its own.
*/
describe("a page's heading", () => {
    const stickyBars = (container: HTMLElement) =>
        container.querySelectorAll(".sticky, .md\\:sticky");

    test("stays in view when there is one", () => {
        const { container } = render(() => (
            <FullscreenProvider>
                <Layout title="Somebody">content</Layout>
            </FullscreenProvider>
        ));

        expect(stickyBars(container)).toHaveLength(1);
        expect(screen.getByRole("heading", { name: "Somebody" })).toBeTruthy();
    });

    test("draws no bar for a header with nothing in it", () => {
        const { container } = render(() => (
            <FullscreenProvider>
                <Layout header={<Show when={false}>a chain</Show>}>content</Layout>
            </FullscreenProvider>
        ));

        expect(stickyBars(container)).toHaveLength(0);
    });
});
