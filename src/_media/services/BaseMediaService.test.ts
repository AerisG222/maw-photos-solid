import { UseQueryResult } from "@tanstack/solid-query";
import { describe, expect, test, vi } from "vitest";

import { CategoryMediaService } from "../../category/services/CategoryMediaService";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { MediaViewGrid } from "../../_models/MediaView";

const succeeded = <T>(data: T) =>
    (() => ({ isSuccess: true, data })) as () => UseQueryResult<T, Error>;

/*
   An empty list - nothing loaded yet, or a filter that leaves nothing - is at
   both ends of itself. These used to guard against a missing list, which an
   empty array is not, and then read its first item: a slideshow running when
   its feed emptied threw, every tick.
*/
describe("an empty list of media", () => {
    const build = () => {
        const goTo = vi.fn();
        const service = new CategoryMediaService(
            goTo,
            () => ({ categoryYear: "2007", categorySlug: "a-category" }),
            MediaViewGrid,
            succeeded<Category | undefined>(undefined),
            succeeded<Media[]>([])
        );

        return { service, goTo };
    };

    test("is both first and last, rather than throwing", () => {
        const { service } = build();

        expect(service.isActiveMediaFirst()).toBe(true);
        expect(service.isActiveMediaLast()).toBe(true);
    });

    test("has nowhere to move to", () => {
        const { service, goTo } = build();

        service.moveNext();
        service.movePrevious();
        service.navigateToFirstMediaIfNeeded();

        expect(goTo).not.toHaveBeenCalled();
    });
});
