import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Media } from "../../_models/Media";
import { MediaTypePhoto } from "../../_models/MediaType";
import { Uuid } from "../../_models/Uuid";
import { ShortcutProvider, useShortcutContext } from "../../_contexts/ShortcutContext";
import FavoriteShortcut from "./FavoriteShortcut";

const mutated: { item: Media; isFavorite: boolean }[] = [];

vi.mock("../../_contexts/api/MediaContext", () => ({
    useMediaContext: () => ({
        setIsFavoriteMutation: {
            mutate: (req: { item: Media; isFavorite: boolean }) => mutated.push(req)
        }
    })
}));

/*
   Favouriting was the one action with no keyboard route at all - which is a
   strange gap for the one action with no other home, since the heart on a tile
   is the only way to do it. §7 asked for `h` and could not have it; deleting the
   badge toggle freed it, which was the unnoticed other half of that argument.
*/
const id = (value: string) => value as unknown as Uuid;

const media = (isFavorite: boolean): Media => ({
    id: id("media-1"),
    slug: "a-photo",
    categoryId: id("cat-1"),
    categoryYear: 2019,
    categorySlug: "a-category",
    type: MediaTypePhoto,
    isFavorite,
    files: []
});

const mount = (activeMedia: Media | undefined) => {
    let shortcuts!: ReturnType<typeof useShortcutContext>;

    const Probe = () => {
        shortcuts = useShortcutContext();

        return <></>;
    };

    render(() => (
        <ShortcutProvider>
            <FavoriteShortcut activeMedia={activeMedia} />
            <Probe />
        </ShortcutProvider>
    ));

    return () => shortcuts[0].shortcuts.flatMap(s => s.shortcut);
};

const press = (key: string) =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

afterEach(() => {
    cleanup();
    mutated.length = 0;
});

describe("the favourite key", () => {
    test("is registered while a photograph is open", () => {
        const keys = mount(media(false));

        expect(keys()).toContain("h");
    });

    /*
       Nothing is selected on a listing - the roving cursor that would once have
       given a "focused tile" is gone - so a key acting there would be acting on
       something the reader cannot see chosen.
    */
    test("and not while a listing is merely being browsed", () => {
        const keys = mount(undefined);

        expect(keys()).not.toContain("h");
    });

    test("marks an unmarked photograph", () => {
        mount(media(false));
        press("h");

        expect(mutated).toEqual([{ item: media(false), isFavorite: true }]);
    });

    test("and unmarks a marked one", () => {
        mount(media(true));
        press("h");

        expect(mutated[0].isFavorite).toBe(false);
    });

    test("it draws nothing", () => {
        const { container } = render(() => (
            <ShortcutProvider>
                <FavoriteShortcut activeMedia={media(false)} />
            </ShortcutProvider>
        ));

        expect(container.textContent).toBe("");
    });
});
