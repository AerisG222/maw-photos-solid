import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Media } from "../../_models/Media";
import BulkEditPreview, { PreviewItem } from "./BulkEditPreview";

/*
   The scales come from the api by way of the config context. One that fills
   the screen is all the preview needs to choose a file.
*/
vi.mock("../../_contexts/api/ConfigContext", () => ({
    useConfigContext: () => ({
        getScalesForMain: () => [{ code: "full-hd", width: 1920, height: 1080 }]
    })
}));

const photo = (slug: string) =>
    ({
        id: `id-${slug}`,
        slug,
        type: "photo",
        files: [{ scale: "full-hd", type: "photo", path: `https://x/${slug}.jpg` }]
    }) as unknown as Media;

const items: PreviewItem[] = [
    { media: photo("first"), isSelected: false },
    { media: photo("second"), isSelected: true },
    { media: photo("third"), isSelected: false }
];

const preview = (
    index: number | undefined,
    over: Partial<Parameters<typeof BulkEditPreview>[0]> = {}
) => {
    const handlers = {
        onIndexChange: vi.fn(),
        onToggle: vi.fn(),
        onClose: vi.fn()
    };

    render(() => (
        <BulkEditPreview
            items={items}
            index={index}
            describeRestriction={() => undefined}
            {...handlers}
            {...over}
        />
    ));

    return handlers;
};

// rendered into a portal on the body - see the note in Dialog.test
afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
});

const dialog = () => screen.getByRole("dialog");

describe("the bulk edit preview", () => {
    test("is not there until a photo is opened", () => {
        preview(undefined);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // the detail view's rendition, not the thumbnail blown up
    test("shows the photo at the size the detail view would", () => {
        preview(1);

        expect(dialog().querySelector("img")?.getAttribute("src")).toBe("https://x/second.jpg");
        expect(dialog()).toHaveTextContent("second");
        expect(dialog()).toHaveTextContent("2 of 3");
    });

    test("steps through the grid with the arrow keys", () => {
        const { onIndexChange } = preview(1);

        fireEvent.keyDown(dialog(), { key: "ArrowRight" });
        expect(onIndexChange).toHaveBeenLastCalledWith(2);

        fireEvent.keyDown(dialog(), { key: "ArrowLeft" });
        expect(onIndexChange).toHaveBeenLastCalledWith(0);
    });

    test("goes no further than either end", () => {
        const { onIndexChange } = preview(0);

        fireEvent.keyDown(dialog(), { key: "ArrowLeft" });

        expect(onIndexChange).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    });

    // choosing from where you stand is the point of previewing here
    test("selects the photo it is showing with space", () => {
        const { onToggle } = preview(1);

        expect(screen.getByLabelText(/selected/i)).toBeChecked();

        fireEvent.keyDown(dialog(), { key: " " });

        expect(onToggle).toHaveBeenCalledWith(items[1].media);
    });

    /*
       The bug this exists for. The dialog used to focus its close button on
       opening, and space on a button presses it - so the first space closed the
       preview rather than selecting, until a click moved focus elsewhere.
    */
    test("opens with nothing pressable focused", () => {
        preview(1);

        expect(document.activeElement).toBe(dialog());
    });

    // Next keeps focus after a click, and the close button can be tabbed to
    test("selects with space even from a focused button", () => {
        const { onToggle, onIndexChange, onClose } = preview(1);

        fireEvent.keyDown(screen.getByRole("button", { name: /next/i }), { key: " " });
        fireEvent.keyDown(screen.getByRole("button", { name: /close/i }), { key: " " });

        expect(onToggle).toHaveBeenCalledTimes(2);
        expect(onIndexChange).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    // the checkbox already toggles itself on space; doing it again would undo it
    test("leaves space to the checkbox", () => {
        const { onToggle } = preview(1);

        fireEvent.keyDown(screen.getByLabelText(/selected/i), { key: " " });

        expect(onToggle).not.toHaveBeenCalled();
    });

    test("says who may see a restricted photo", () => {
        preview(0, { describeRestriction: () => "Restricted to admin" });

        expect(dialog()).toHaveTextContent("Restricted to admin");
    });
});
