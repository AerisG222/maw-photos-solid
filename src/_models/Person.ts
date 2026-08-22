import { Uuid } from "./Uuid";

/*
   Someone the recognition pipeline has identified across the media library.

   `mediaCount` and `isFavorite` are both scoped by the API to the caller - one
   user's favorites say nothing about anyone else's - so both are safe to show
   as-is. The preferred face is whatever crop the pipeline picked to
   represent the cluster; it is absent until one has been published, so both the
   id and the url can be null on a person who is otherwise perfectly valid.
*/
export interface Person {
    id: Uuid;
    name: string;
    slug: string | null;
    preferredFaceId: Uuid | null;
    preferredFaceUrl: string | null;
    mediaCount: number;
    isFavorite: boolean;
}
