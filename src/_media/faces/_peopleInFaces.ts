import { DetectedFace } from "../../_models/DetectedFace";
import { Person } from "../../_models/Person";
import { Uuid } from "../../_models/Uuid";

export interface PeopleInFaces {
    // one each, in the order their first face appears in the frame
    readonly people: Person[];
    // faces nobody has put a name to yet
    readonly unidentified: number;
}

/*
   Who is in a photograph, from the faces found in it.

   Shared by the face overlay and the Who card, which answer the same question
   in two places: the overlay shows *where in the frame* each person is, the
   card lets you read the list and follow a name to everything else they are in.
   Resolving it twice would have been two chances to disagree about who counts.

   A person photographed twice in one frame appears once. A face whose person
   is known to the detector but missing from the list handed in - the list is
   the people this reader can see - is counted as unidentified rather than
   dropped, because to the reader that is exactly what it is.
*/
export const peopleInFaces = (faces: readonly DetectedFace[], people: readonly Person[]) => {
    const byId = new Map<Uuid, Person>(people.map(person => [person.id, person]));
    const seen = new Map<Uuid, Person>();
    let unidentified = 0;

    for (const face of faces) {
        const person = face.personId ? byId.get(face.personId) : undefined;

        /*
           The map is the deduplication. Setting a key it already holds keeps
           the original position, so a person seen twice stays where they were
           first seen without being checked for.
        */
        if (person) {
            seen.set(person.id, person);
        } else {
            unidentified++;
        }
    }

    return { people: [...seen.values()], unidentified } satisfies PeopleInFaces;
};
