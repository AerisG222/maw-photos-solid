import { describe, expect, test } from "vitest";

import { DetectedFace } from "../../_models/DetectedFace";
import { Person } from "../../_models/Person";
import { Uuid } from "../../_models/Uuid";
import { peopleInFaces } from "./_peopleInFaces";

/*
   Who is in a photograph, from the faces found in it.

   Shared by the face overlay and the Who card, so the two cannot disagree about
   who counts - the reason it is pulled out rather than written once in each.
*/
const id = (value: string) => value as unknown as Uuid;

const face = (personId: string | null): DetectedFace => ({
    id: id(`face-${Math.random()}`),
    personId: personId === null ? null : id(personId),
    boxX: 0,
    boxY: 0,
    boxWidth: 0,
    boxHeight: 0
});

const person = (value: string, name: string) =>
    ({ id: id(value), name, slug: null }) as unknown as Person;

const ann = person("p1", "Ann");
const bob = person("p2", "Bob");

describe("who is in a photograph", () => {
    test("names each person whose face was found", () => {
        const { people } = peopleInFaces([face("p1"), face("p2")], [ann, bob]);

        expect(people.map(p => p.name)).toEqual(["Ann", "Bob"]);
    });

    // somebody photographed twice in one frame - a mirror, a reflection - is one person
    test("lists a person once however many times they appear", () => {
        const { people } = peopleInFaces([face("p1"), face("p1"), face("p2")], [ann, bob]);

        expect(people.map(p => p.name)).toEqual(["Ann", "Bob"]);
    });

    test("in the order they first appear, not the order they are known", () => {
        const { people } = peopleInFaces([face("p2"), face("p1")], [ann, bob]);

        expect(people.map(p => p.name)).toEqual(["Bob", "Ann"]);
    });

    /*
       Counted rather than dropped. A face nobody has named is a prompt to go and
       name it, and leaving it out would make the list look complete.
    */
    test("counts the faces nobody has named", () => {
        const { people, unidentified } = peopleInFaces([face("p1"), face(null), face(null)], [ann]);

        expect(people).toHaveLength(1);
        expect(unidentified).toBe(2);
    });

    /*
       A face tied to a person this reader cannot see - the list is only the
       people visible to them - is, to that reader, exactly an unnamed face.
    */
    test("treats a person missing from the list as unnamed, not as absent", () => {
        const { people, unidentified } = peopleInFaces([face("p1"), face("hidden")], [ann]);

        expect(people.map(p => p.name)).toEqual(["Ann"]);
        expect(unidentified).toBe(1);
    });

    test("and finds nobody in a photograph with no faces", () => {
        expect(peopleInFaces([], [ann, bob])).toEqual({ people: [], unidentified: 0 });
    });
});
