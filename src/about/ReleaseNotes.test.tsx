import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import ViewReleaseNotes from "./ReleaseNotes";

describe("ViewReleaseNotes component", () => {
    test("should assert something", () => {
        const { getByText, unmount } = render(() => <ViewReleaseNotes />);
        expect(getByText("Release Notes"));
        unmount();
    });
});
