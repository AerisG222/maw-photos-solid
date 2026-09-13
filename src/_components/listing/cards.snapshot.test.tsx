import { Router } from "@solidjs/router";
import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, expect, test } from "vitest";

import { Category } from "../../_models/Category";
import { Uuid } from "../../_models/Uuid";
import { MediaFileType } from "../../_models/MediaFileType";
import { MediaTypePhoto, MediaTypeVideo } from "../../_models/MediaType";
import { Media } from "../../_models/Media";
import { Person } from "../../_models/Person";
import { Place, PlaceKindCity } from "../../_models/Place";
import { AllSettingsProvider } from "../../_contexts/settings/AllSettingsProvider";

import CategoryCard from "../categories/CategoryCard";
import MediaLink from "../../_media/MediaLink";
import PersonCard from "../../people/components/PersonCard";
import PlaceCard from "../../places/components/PlaceCard";

/*
   What these cards render, character for character.

   The four of them independently re-implement the same tile: a link wrapping a
   two-by-two box, an image that fades in once, a desaturation that lifts on
   hover, badges pinned to the corners and an optional label. Folding that into
   one component is a refactor of every listing in the application, and the
   dialogs in step 5 are a reminder that this repo's tests happily pass while
   the result is invisible.

   So the markup is pinned here first. If the extraction is honest these
   snapshots do not move, and "no visual change" is a fact rather than a hope.
   A snapshot that *does* move is not necessarily wrong - but it has to be
   looked at in a browser before it is accepted.
*/

// the ids are branded, and a fixture does not need a real one
const id = (value: string) => value as unknown as Uuid;

const media: Media = {
    id: id("media-1"),
    slug: "a-photo",
    categoryId: id("cat-1"),
    categoryYear: 2019,
    categorySlug: "a-category",
    type: MediaTypePhoto,
    isFavorite: false,
    files: [
        {
            id: id("file-1"),
            scale: "qqvg-fill",
            type: "photo" as MediaFileType,
            path: "/teaser.jpg"
        }
    ]
};

const category: Category = {
    id: id("cat-1"),
    year: 2019,
    slug: "a-category",
    name: "A Category",
    effectiveDate: new Date("2019-06-01T00:00:00Z"),
    modified: new Date("2019-06-02T00:00:00Z"),
    isFavorite: true,
    teaser: media,
    mediaTypes: [MediaTypePhoto, MediaTypeVideo]
};

const person: Person = {
    id: id("person-1"),
    name: "A Person",
    slug: "a-person",
    preferredFaceId: id("face-1"),
    preferredFaceUrl: "/face.jpg",
    mediaCount: 12,
    isFavorite: true
};

const place: Place = {
    id: id("place-1"),
    parentId: null,
    kind: PlaceKindCity,
    name: "A City",
    slug: "a-city",
    mediaCount: 34,
    ancestorNames: ["A Country", "A State"],
    coverUrl: "/cover.jpg",
    coverMediaId: id("media-1"),
    childCount: 0
};

/*
   One router, one render, for all four.

   A router per test does not survive this suite: `isolate: false` keeps the
   previous one alive past its container, and the next `resolvePath` walks a
   torn-down tree. Which test fails rotates, which is the tell.
*/
const cards = () => (
    <>
        <div data-card="CategoryCard">
            <CategoryCard category={category} eager={false} setIsFavorite={() => undefined} />
        </div>

        <div data-card="PersonCard">
            <PersonCard
                person={person}
                eager={false}
                selectable={true}
                selected={false}
                setIsFavorite={() => undefined}
                toggleSelected={() => undefined}
            />
        </div>

        <div data-card="PlaceCard">
            <PlaceCard place={place} href="/places/place-1" showAncestry={true} eager={false} />
        </div>

        <div data-card="MediaLink">
            <MediaLink
                href="/media/1"
                media={media}
                eager={false}
                setIsFavorite={() => undefined}
            />
        </div>
    </>
);

afterEach(() => {
    cleanup();
    localStorage.clear();
});

/*
   All four in one test, deliberately. The library registers its own
   `afterEach(cleanup)`, so a render shared across tests via `beforeAll` is torn
   down after the first of them - and a router per test does not survive this
   suite either. One render, four named snapshots.
*/
test("the tiles each listing draws", () => {
    const { container } = render(() => (
        <Router root={props => <AllSettingsProvider>{props.children}</AllSettingsProvider>}>
            {[{ path: "/", component: cards as never }]}
        </Router>
    ));

    for (const name of ["CategoryCard", "PersonCard", "PlaceCard", "MediaLink"]) {
        const el = container.querySelector(`[data-card="${name}"]`);

        expect(el, `${name} did not render`).toBeTruthy();
        expect(el!.innerHTML).toMatchSnapshot(name);
    }
});
