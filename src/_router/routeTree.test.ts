import { describe, expect, test } from "vitest";

import { toTanStackPath } from "./routeTree";

describe("route paths in TanStack's syntax", () => {
    test("a param", () => {
        expect(toTanStackPath("/people/:personId")).toBe("people/$personId");
    });

    test("an optional param", () => {
        expect(toTanStackPath("/grid/:mediaSlug?")).toBe("grid/{-$mediaSlug}");
    });

    test("a nested pair of params", () => {
        expect(toTanStackPath("/categories/:categoryYear/:categorySlug")).toBe(
            "categories/$categoryYear/$categorySlug"
        );
    });

    // the catch-all, named or not
    test("a splat", () => {
        expect(toTanStackPath("*")).toBe("$");
        expect(toTanStackPath("/files/*rest")).toBe("files/$");
    });

    // a parent's index route
    test("the root of a section", () => {
        expect(toTanStackPath("/")).toBe("/");
    });
});
