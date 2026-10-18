import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from "@tanstack/solid-query";
import { describe, expect, test, vi } from "vitest";

import { FeedMediaService } from "../feed/FeedMediaService";
import { RandomMediaService } from "../../random/services/RandomMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaViewGrid } from "../../_models/MediaView";
import { SearchResults } from "../../_models/SearchResults";

const media = (slug: string) =>
    ({ id: slug, slug, categoryYear: 2019, categorySlug: "a-trip" }) as unknown as Media;

const noCategory = (() => ({ data: undefined })) as unknown as () => UseQueryResult<
    Category | undefined,
    Error
>;

const pages = <T>(isSuccess: boolean, ...loaded: (T | undefined)[]) =>
    (() => ({ isSuccess, data: { pages: loaded } })) as unknown as () => UseInfiniteQueryResult<
        InfiniteData<T | undefined>,
        Error
    >;

const random = (query: ReturnType<typeof pages<Media[]>>) =>
    new RandomMediaService(vi.fn(), () => ({}), MediaViewGrid, noCategory, query);

describe("a paged stack of media", () => {
    test("is every loaded page in order, skipping a page that has not arrived", () => {
        const service = random(pages(true, [media("a"), media("b")], undefined, [media("c")]));

        expect(service.getMediaList().map(m => m.slug)).toEqual(["a", "b", "c"]);
    });

    test("is empty until the first page has", () => {
        expect(random(pages<Media[]>(false)).getMediaList()).toEqual([]);
    });

    // a feed's page is a search result, not a bare list
    test("reads each page the way its feed carries it", () => {
        const service = new FeedMediaService(
            vi.fn(),
            () => ({}),
            MediaViewGrid,
            () => ({ type: "person", id: "p" }) as never,
            () => ({}),
            noCategory,
            pages<SearchResults<Media>>(true, { results: [media("a")] } as SearchResults<Media>)
        );

        expect(service.getMediaList().map(m => m.slug)).toEqual(["a"]);
    });

    test("opens its first photo when none is open", () => {
        const goTo = vi.fn();
        const service = new RandomMediaService(
            goTo,
            () => ({}),
            MediaViewGrid,
            noCategory,
            pages(true, [media("a"), media("b")])
        );

        service.navigateToFirstMediaIfNeeded();

        expect(goTo).toHaveBeenCalledOnce();
        expect(goTo.mock.calls[0]?.[0]).toMatchObject({ params: { mediaSlug: "a" } });
    });
});
