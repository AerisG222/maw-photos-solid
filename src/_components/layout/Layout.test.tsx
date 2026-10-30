import { cleanup, render } from "@solidjs/testing-library";
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
