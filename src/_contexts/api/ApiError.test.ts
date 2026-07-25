import { describe, expect, it } from "vitest";

import { ApiError, describeError } from "./ApiError";

describe("ApiError", () => {
    it("classifies 401 and 403 as auth errors", () => {
        expect(new ApiError(401, "Unauthorized", "media/1").isAuthError).toBe(true);
        expect(new ApiError(403, "Forbidden", "media/1").isAuthError).toBe(true);
        expect(new ApiError(404, "Not Found", "media/1").isAuthError).toBe(false);
    });

    it("treats 4xx as client errors and 5xx as not", () => {
        // this is what stops the retry policy from replaying a doomed request
        expect(new ApiError(404, "Not Found", "media/1").isClientError).toBe(true);
        expect(new ApiError(499, "Client Closed", "media/1").isClientError).toBe(true);
        expect(new ApiError(500, "Server Error", "media/1").isClientError).toBe(false);
    });

    it("keeps the status and url for diagnostics", () => {
        const error = new ApiError(500, "Server Error", "categories/years");

        expect(error.status).toBe(500);
        expect(error.message).toContain("500");
        expect(error.message).toContain("categories/years");
    });
});

describe("describeError", () => {
    it("explains auth failures", () => {
        expect(describeError(new ApiError(403, "Forbidden", "x"))).toMatch(/permission/i);
    });

    it("explains missing resources", () => {
        expect(describeError(new ApiError(404, "Not Found", "x"))).toMatch(/could not find/i);
    });

    it("calls server failures temporary", () => {
        expect(describeError(new ApiError(503, "Unavailable", "x"))).toMatch(/temporary/i);
    });

    it("explains an unreachable server", () => {
        // fetch rejects with TypeError when the request never lands
        expect(describeError(new TypeError("Failed to fetch"))).toMatch(/connection/i);
    });

    it("never leaks an internal message for an unknown throw", () => {
        const described = describeError(new Error("column users.secret does not exist"));

        expect(described).toBe("Something went wrong.");
        expect(described).not.toContain("secret");
    });

    it("handles a non-error being thrown", () => {
        expect(describeError("boom")).toBe("Something went wrong.");
        expect(describeError(undefined)).toBe("Something went wrong.");
    });
});
