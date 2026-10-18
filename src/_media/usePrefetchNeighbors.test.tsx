import { createSignal } from "solid-js";
import { QueryClientProvider } from "@tanstack/solid-query";
import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Media } from "../_models/Media";
import { MediaViewGrid } from "../_models/MediaView";
import { InspectorCardComments, InspectorCardIdType } from "../_models/InspectorCard";
import { Uuid } from "../_models/Uuid";
import { IMediaService } from "./services/IMediaService";
import { createAppQueryClient } from "../_contexts/api/queryClient";

const settings = vi.hoisted(() => ({
    media: { inspectorOpen: true, inspectorCards: [] as string[] },
    listing: { highlightFaces: false }
}));

vi.mock("../_contexts/AuthContext", () => ({
    useAuthContext: () => [
        { isLoggedIn: true, accountStatus: { status: "active", isAdmin: false } },
        { getToken: () => Promise.resolve("token") }
    ]
}));
vi.mock("../_contexts/api/ConfigContext", () => ({
    useConfigContext: () => ({ getScalesForMain: () => [] })
}));
vi.mock("../_contexts/settings/MediaSettingsContext", () => ({
    useMediaSettingsContext: () => [settings.media]
}));
vi.mock("../_contexts/settings/ListingSettingsContext", () => ({
    useListingSettingsContext: () => [settings.listing]
}));

import { usePrefetchNeighbors } from "./usePrefetchNeighbors";

const media = (id: string) =>
    ({ id: id as Uuid, slug: id, type: "photo", files: [] }) as unknown as Media;

const fetched: string[] = [];

const mount = (cards: InspectorCardIdType[], inspectorOpen = true) => {
    settings.media.inspectorOpen = inspectorOpen;
    settings.media.inspectorCards = cards;

    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
        fetched.push(
            typeof input === "string" ? input : input instanceof URL ? input.href : input.url
        );

        return Promise.resolve(new Response("[]", { status: 200 }));
    });

    const [active, setActive] = createSignal(media("open"));
    const service = {
        getActiveMedia: () => active(),
        // each photo's neighbors named after it, so a new photo has new ones
        getNeighbors: () => ({
            previous: media(`${active().id}-previous`),
            next: media(`${active().id}-next`)
        }),
        getActiveCategory: () => undefined,
        canChooseCategoryTeaser: () => false
    } as unknown as IMediaService;

    const Probe = () => {
        usePrefetchNeighbors({ mediaService: service, view: MediaViewGrid });

        return null;
    };

    render(() => (
        <QueryClientProvider client={createAppQueryClient()}>
            <Probe />
        </QueryClientProvider>
    ));

    return { setActive };
};

const settle = () => new Promise(resolve => setTimeout(resolve, 20));

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    fetched.length = 0;
});

describe("the photos either side of the open one", () => {
    test("have the open cards' data fetched ahead", async () => {
        mount([InspectorCardComments]);
        await settle();

        expect(fetched.some(url => url.endsWith("media/open-next/comments"))).toBe(true);
        expect(fetched.some(url => url.endsWith("media/open-previous/comments"))).toBe(true);
    });

    // the EXIF card is closed, so its answer is not worth asking for yet
    test("but not a closed card's", async () => {
        mount([InspectorCardComments]);
        await settle();

        expect(fetched.some(url => url.endsWith("/metadata"))).toBe(false);
    });

    test("and nothing for the cards at all while the inspector is shut", async () => {
        mount([InspectorCardComments], false);
        await settle();

        expect(fetched).toEqual([]);
    });

    test("and again for the new neighbors when another photo opens", async () => {
        const { setActive } = mount([InspectorCardComments]);
        await settle();
        fetched.length = 0;

        setActive(media("another"));
        await settle();

        expect(fetched.some(url => url.endsWith("media/another-next/comments"))).toBe(true);
        expect(fetched.some(url => url.endsWith("media/another-previous/comments"))).toBe(true);
    });
});
