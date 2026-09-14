import { describe, expect, test } from "vitest";

import {
    InspectorCardCategoryTeaser,
    InspectorCardHistogram,
    InspectorCardMetadata,
    InspectorCardMinimap,
    InspectorCardPlaceCovers
} from "../../_models/InspectorCard";
import { MediaView, MediaViewBulkEdit, MediaViewGrid, MediaViewMap } from "../../_models/MediaView";
import { InspectorContext, applicableCards, inspectorCards } from "./registry";

const context = (over: Partial<InspectorContext> = {}): InspectorContext => ({
    view: MediaViewGrid,
    media: { id: "media-1" } as unknown as InspectorContext["media"],
    category: undefined,
    isAdmin: false,
    enableCategoryTeaser: false,
    hasMediaElement: true,
    ...over
});

const ids = (ctx: InspectorContext) => applicableCards(ctx).map(card => card.id);

describe("which cards apply", () => {
    /*
       The point of the registry. Comments, EXIF and the effects used to exist on
       the detail view alone, so browsing a grid and wanting to know when
       something was taken meant leaving the grid.

       Fullscreen used to be the second view in this list. It is a state of the
       grid now rather than a view of its own, so the grid's answer is the one
       it inherits.
    */
    test.each<MediaView>([MediaViewGrid, MediaViewBulkEdit])(
        "the same cards are offered in %s",
        view => {
            expect(ids(context({ view }))).toEqual(ids(context({ view: MediaViewGrid })));
        }
    );

    test("the minimap stands aside on the map, where it would say the same thing twice", () => {
        expect(ids(context({ view: MediaViewMap }))).not.toContain(InspectorCardMinimap);
        expect(ids(context({ view: MediaViewGrid }))).toContain(InspectorCardMinimap);
    });

    test("the histogram needs an element whose pixels it can read", () => {
        expect(ids(context({ hasMediaElement: false }))).not.toContain(InspectorCardHistogram);
        expect(ids(context({ hasMediaElement: true }))).toContain(InspectorCardHistogram);
    });

    test("the editing cards are for administrators", () => {
        const asReader = ids(context({ isAdmin: false }));

        expect(asReader).not.toContain(InspectorCardMetadata);
        expect(asReader).not.toContain(InspectorCardPlaceCovers);

        expect(ids(context({ isAdmin: true }))).toContain(InspectorCardMetadata);
    });

    /*
       A category teaser only means something while browsing that category. Where
       a photograph was taken travels with it, which is why place covers are not
       gated the same way.
    */
    test("the category teaser needs a category being browsed, as well as admin", () => {
        expect(ids(context({ isAdmin: true, enableCategoryTeaser: false }))).not.toContain(
            InspectorCardCategoryTeaser
        );
        expect(ids(context({ isAdmin: true, enableCategoryTeaser: true }))).toContain(
            InspectorCardCategoryTeaser
        );
        expect(ids(context({ isAdmin: true, enableCategoryTeaser: false }))).toContain(
            InspectorCardPlaceCovers
        );
    });

    test("every card is declared once, and the rail order is stable", () => {
        const declared = inspectorCards.map(card => card.id);

        expect(declared).toEqual([...new Set(declared)]);
        expect(ids(context({ isAdmin: true, enableCategoryTeaser: true }))).toEqual(declared);
    });

    /*
       The bug this exists for. The detail view was gated on having a photograph
       open, so every card could reach into one without checking. Mounting the
       inspector in a grid and a map - which can be looked at with nothing
       selected - meant the comments card asked the API for the comments of
       `undefined` and the page fell over.
    */
    test("nothing applies when nothing is selected", () => {
        expect(
            ids(context({ media: undefined, isAdmin: true, enableCategoryTeaser: true }))
        ).toEqual([]);
    });
});
