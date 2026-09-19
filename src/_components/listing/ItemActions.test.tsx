import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Media } from "../../_models/Media";
import { MediaFileType } from "../../_models/MediaFileType";
import { MediaTypePhoto } from "../../_models/MediaType";
import { Uuid } from "../../_models/Uuid";
import ItemActions from "./ItemActions";
import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";
import { defaultAppSettings } from "../../_contexts/settings/_state";
import { KEY_SETTINGS_V2_APP, KEY_SETTINGS_V2_MIGRATED } from "../../_contexts/settings/_storage";
import { JSX } from "solid-js";

const fetched: string[] = [];

/*
   `fetchFile` is the authorized fetch - every asset is behind a bearer token,
   which is why a share cannot simply hand over a link to one.
*/
vi.mock("../../_contexts/api/CategoriesContext", () => ({
    useCategoriesContext: () => ({
        downloadFile: () => Promise.resolve(),
        fetchFile: (url: string) => {
            fetched.push(url);

            return Promise.resolve(new Blob(["bytes"], { type: "image/jpeg" }));
        }
    })
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
    files: [
        {
            id: id("file-1"),
            scale: "full-hd",
            type: "photo" as MediaFileType,
            path: "https://assets.example.com/a-photo.jpg"
        }
    ]
};

/*
   `"files"` stands for a phone, `"url"` for a desktop that takes a link and
   nothing else, `"none"` for a platform without Web Share at all.
*/
const withShare = (takes: "files" | "url" | "none") => {
    const shared: { url?: string; files?: File[] }[] = [];

    vi.stubGlobal("navigator", {
        ...navigator,
        canShare:
            takes === "none"
                ? undefined
                : (data: { url?: string; files?: File[] }) =>
                      takes === "files" ? !!data.files : !!data.url,
        share: (data: { url?: string; files?: File[] }) => {
            shared.push(data);

            return Promise.resolve();
        }
    });

    return shared;
};

// the trigger reads whether toolbar labels are on
const renderActions = (ui: () => JSX.Element) =>
    render(() => <AllSettingsProvider>{ui()}</AllSettingsProvider>);

// Kobalte's trigger opens on pointerdown rather than click
const open = () => {
    const trigger = screen.getByLabelText("More actions for this item");

    fireEvent.pointerDown(trigger, { pointerType: "mouse", button: 0 });
    fireEvent.pointerUp(trigger, { pointerType: "mouse", button: 0 });
    fireEvent.click(trigger);
};

// as with the trigger, a menu item selects on pointer events
const select = (item: HTMLElement) => {
    fireEvent.pointerDown(item, { pointerType: "mouse", button: 0 });
    fireEvent.pointerUp(item, { pointerType: "mouse", button: 0 });
    fireEvent.click(item);
};

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe("sharing a photograph", () => {
    test("is offered where the platform supports it", async () => {
        withShare("url");

        renderActions(() => (
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
        withShare("none");

        renderActions(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();

        await screen.findByText("High Resolution");

        expect(screen.queryByText("Share")).not.toBeInTheDocument();
    });

    /*
       The application's address, not the file's. A link to an asset is behind a
       token the recipient does not have; a link into the app works because they
       sign in and it fetches the file as them.
    */
    test("shares the app's address for the photograph, not the file's", async () => {
        const shared = withShare("url");

        renderActions(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();

        select(await screen.findByText("Share"));

        expect(shared).toHaveLength(1);
        expect((shared[0] as { url: string }).url).toBe(
            `${window.location.origin}/categories/2019/a-category/grid/a-photo`
        );
    });

    /*
       The point of sharing a photograph is the photograph.

       A link into this application is only useful to somebody who has an
       account here, which is nobody a photo is usually sent to. Where the
       platform takes files - which is to say, a phone - the bytes go instead,
       fetched through the same authorized request a download uses.
    */
    test("a phone is given the photograph itself, not a link", async () => {
        const shared = withShare("files");

        renderActions(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();
        select(await screen.findByText("Share"));

        await vi.waitFor(() => expect(shared).toHaveLength(1));

        expect(shared[0].url).toBeUndefined();
        expect(shared[0].files?.[0]).toBeInstanceOf(File);
        expect(shared[0].files?.[0].type).toBe("image/jpeg");
    });

    // through the authorized fetch, because the asset is behind a bearer token
    test("and the bytes come from the protected asset", async () => {
        withShare("files");
        fetched.length = 0;

        renderActions(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
        open();
        select(await screen.findByText("Share"));

        await vi.waitFor(() => expect(fetched).toEqual(["https://assets.example.com/a-photo.jpg"]));
    });
});

describe("the trigger", () => {
    afterEach(() => localStorage.clear());

    const renderWithLabels = (showToolbarLabels: boolean) => {
        localStorage.setItem(
            KEY_SETTINGS_V2_APP,
            JSON.stringify({ ...defaultAppSettings, showToolbarLabels })
        );
        localStorage.setItem(KEY_SETTINGS_V2_MIGRATED, "true");

        renderActions(() => (
            <ItemActions
                activeMedia={media}
                activeCategory={undefined}
                canDownloadCategory={false}
            />
        ));
    };

    const label = () => screen.getByText("Actions");

    // like every other toolbar control, the name shows once labels are turned on
    test("is named alongside the rest when labels are on", () => {
        renderWithLabels(true);

        expect(label()).toHaveClass("md:inline");
    });

    test("and is an icon alone when they are off", () => {
        renderWithLabels(false);

        expect(label()).not.toHaveClass("md:inline");
    });

    test("keyboard focus shows what it is", async () => {
        renderWithLabels(false);

        fireEvent.focus(screen.getByLabelText("More actions for this item"));

        expect(await screen.findByRole("tooltip")).toHaveTextContent("More actions");
    });
});
