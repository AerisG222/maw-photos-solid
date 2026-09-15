import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Media } from "../../_models/Media";
import { MediaTypePhoto } from "../../_models/MediaType";
import { Uuid } from "../../_models/Uuid";
import ItemActions from "./ItemActions";

// the menu reaches for it to download; nothing here exercises that path
vi.mock("../../_contexts/api/CategoriesContext", () => ({
    useCategoriesContext: () => ({ downloadFile: () => Promise.resolve() })
}));

/*
   The `⋮` menu, and the share that had never worked.

   Two faults, neither of them visible without a platform that supports Web
   Share. `getMediaShareUrl` returned the string "TODO" - the assets are served
   behind a bearer token the service worker attaches, so a link to a file is
   useless to whoever receives it, and the app's own address for the photograph
   is the answer. And the item was gated on `navigator.canShare()` with no
   argument, which the specification defines as asking whether an empty payload
   is shareable: always no, on every platform.
*/
const id = (value: string) => value as unknown as Uuid;

const media: Media = {
    id: id("media-1"),
    slug: "a-photo",
    categoryId: id("cat-1"),
    categoryYear: 2019,
    categorySlug: "a-category",
    type: MediaTypePhoto,
    isFavorite: false,
    files: []
};

const withShare = (supported: boolean) => {
    const shared: unknown[] = [];

    vi.stubGlobal("navigator", {
        ...navigator,
        canShare: supported
            ? (data: unknown) => !!data && !!(data as { url?: string }).url
            : undefined,
        share: (data: unknown) => {
            shared.push(data);

            return Promise.resolve();
        }
    });

    return shared;
};

// Kobalte's trigger opens on pointerdown rather than click
const open = () => {
    const trigger = screen.getByLabelText("More actions for this item");

    fireEvent.pointerDown(trigger, { pointerType: "mouse", button: 0 });
    fireEvent.pointerUp(trigger, { pointerType: "mouse", button: 0 });
    fireEvent.click(trigger);
};

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("sharing a photograph", () => {
    test("is offered where the platform supports it", async () => {
        withShare(true);

        render(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();

        expect(await screen.findByText("Share")).toBeTruthy();
    });

    // the bare `canShare()` asked whether nothing was shareable, and was told no
    test("and not where it does not", async () => {
        withShare(false);

        render(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();

        await screen.findByText("High Resolution");

        expect(screen.queryByText("Share")).toBeNull();
    });

    /*
       The application's address, not the file's. A link to an asset is behind a
       token the recipient does not have; a link into the app works because they
       sign in and it fetches the file as them.
    */
    test("shares the app's address for the photograph, not the file's", async () => {
        const shared = withShare(true);

        render(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();

        const item = await screen.findByText("Share");

        // as with the trigger, a menu item selects on pointer events
        fireEvent.pointerDown(item, { pointerType: "mouse", button: 0 });
        fireEvent.pointerUp(item, { pointerType: "mouse", button: 0 });
        fireEvent.click(item);

        expect(shared).toHaveLength(1);
        expect((shared[0] as { url: string }).url).toBe(
            `${window.location.origin}/categories/2019/a-category/grid/a-photo`
        );
    });
});
