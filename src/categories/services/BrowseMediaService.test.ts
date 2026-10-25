import { createRoot, createSignal } from "solid-js";
import { UseQueryResult } from "@tanstack/solid-query";
import { LinkOptions } from "@tanstack/solid-router";
import { describe, expect, test, vi } from "vitest";

import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaViewGrid } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { CategoriesSearch } from "../_search";

// the route tree is only needed for the grid's `.to`
vi.mock("../_routeTree", () => ({ categoriesGridRoute: { to: "/categories/grid" } }));

import { BrowseMediaService } from "./BrowseMediaService";

const CATEGORY = "11111111-1111-4111-8111-111111111111" as Uuid;

const category = { id: CATEGORY, year: 2024, slug: "a-trip" } as Category;

const photo = (slug: string) =>
    ({
        id: `id-${slug}` as Uuid,
        slug,
        categoryId: CATEGORY,
        categoryYear: 2024,
        categorySlug: "a-trip"
    }) as Media;

const photos = [photo("first"), photo("second"), photo("third")];

const mount = (initial: CategoriesSearch) =>
    createRoot(() => {
        const [search, setSearch] = createSignal<CategoriesSearch>(initial);
        const goTo = vi.fn<(link: LinkOptions) => void>();
        const categoryQuery = {
            isSuccess: true,
            data: category
        } as UseQueryResult<Category | undefined, Error>;

        const service = new BrowseMediaService(
            goTo,
            search,
            () => categoryQuery,
            () => photos
        );

        return { service, goTo, setSearch };
    });

describe("a photo opened while browsing every category", () => {
    test("is found from the search", () => {
        const { service } = mount({ year: 2024, category: CATEGORY, photo: "second" });

        expect(service.getActiveMedia()?.slug).toBe("second");
    });

    test("is not open without one", () => {
        const { service } = mount({ year: 2024 });

        expect(service.getActiveMedia()).toBeUndefined();
    });

    // the listing's filters stay as they were, only the photo changes
    test("opens and closes on the same page", () => {
        const { service } = mount({ year: 2024, category: CATEGORY, photo: "second" });

        expect(service.getMediaLinkByView(MediaViewGrid, photos[2]).search).toEqual({
            year: 2024,
            category: CATEGORY,
            photo: "third"
        });
        expect(service.getEntryLinkByView(MediaViewGrid).search).toEqual({ year: 2024 });
    });

    test("steps through its category", () => {
        const { service, goTo } = mount({ year: "all", category: CATEGORY, photo: "second" });

        expect(service.getNeighbors()).toEqual({ previous: photos[0], next: photos[2] });

        service.moveNext();

        expect(goTo.mock.lastCall?.[0].search).toEqual({
            year: "all",
            category: CATEGORY,
            photo: "third"
        });
    });

    test("offers no other views, and the teaser chooser", () => {
        const { service } = mount({});

        expect(service.getAvailableViews()).toEqual([]);
        expect(service.canChooseCategoryTeaser()).toBe(true);
        expect(service.canDownloadCategory()).toBe(false);
    });
});
