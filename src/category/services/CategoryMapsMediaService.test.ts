import { describe, expect, it, vi } from "vitest";
import { UseQueryResult } from "@tanstack/solid-query";

import { Category } from "../../_models/Category";
import { GpsDetail } from "../../_models/GpsDetail";
import { Media } from "../../_models/Media";
import { MediaViewMap } from "../../_models/MediaView";
import { Uuid } from "../../_models/Uuid";
import { CategoryMapsMediaService } from "./CategoryMapsMediaService";

const id = (value: string) => value as unknown as Uuid;

const category = { id: id("cat"), year: 2007, slug: "hong-kong" } as Category;

const media = (slug: string) =>
    ({
        id: id(slug),
        slug,
        categoryId: id("cat"),
        categoryYear: 2007,
        categorySlug: "hong-kong"
    }) as Media;

const located = (slug: string): GpsDetail => ({
    mediaId: id(slug),
    recorded: { latitude: 22.3, longitude: 114.2 },
    override: undefined
});

const succeeded = <T>(data: T) =>
    (() => ({ isSuccess: true, data })) as () => UseQueryResult<T, Error>;

// a b c d e, of which only a, c and e have a location
const build = (mediaSlug?: string) => {
    const navigate = vi.fn();
    const service = new CategoryMapsMediaService(
        navigate,
        { categoryYear: "2007", categorySlug: "hong-kong", mediaSlug },
        MediaViewMap,
        succeeded<Category | undefined>(category),
        succeeded(["a", "b", "c", "d", "e"].map(media)),
        succeeded(["a", "c", "e"].map(located))
    );

    const movedTo = () => (navigate.mock.calls[0]?.[0] as string | undefined)?.split("/").pop();

    return { service, navigate, movedTo };
};

describe("CategoryMapsMediaService", () => {
    it("moves between the photos with a location", () => {
        const next = build("c");
        next.service.moveNext();
        expect(next.movedTo()).toBe("e");

        const previous = build("c");
        previous.service.movePrevious();
        expect(previous.movedTo()).toBe("a");
    });

    // the map opened on a photo without a location used to be stuck there
    it("moves on from a photo without a location", () => {
        const next = build("b");
        next.service.moveNext();
        expect(next.movedTo()).toBe("c");

        const previous = build("d");
        previous.service.movePrevious();
        expect(previous.movedTo()).toBe("c");
    });

    // index 0 was taken for "nothing there"
    it("moves back to the first photo", () => {
        const { service, movedTo } = build("c");

        service.movePrevious();

        expect(movedTo()).toBe("a");
    });

    it("knows the ends among the photos with a location", () => {
        expect(build("a").service.isActiveMediaFirst()).toBe(true);
        expect(build("b").service.isActiveMediaFirst()).toBe(false);
        expect(build("e").service.isActiveMediaLast()).toBe(true);
        expect(build("d").service.isActiveMediaLast()).toBe(false);
    });

    it("goes nowhere past the ends", () => {
        const { service, navigate } = build("e");

        service.moveNext();

        expect(navigate).not.toHaveBeenCalled();
    });

    it("starts at the first photo with a location when none is open", () => {
        const { service, movedTo } = build(undefined);

        service.moveNext();

        expect(movedTo()).toBe("a");
    });
});
