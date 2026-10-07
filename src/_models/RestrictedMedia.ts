import { MediaType } from "./MediaType";
import { Uuid } from "./Uuid";

/*
   One restricted media, as maw-media lists them for an admin.

   Metadata only, with no files: the list includes photos restricted to roles the
   admin asking does not hold - `isVisibleToYou: false` - which drop out of every
   other listing, and whose files `/assets` would refuse them. Joined to the
   media a screen already has on `mediaId`, the way gps is.
*/
export interface RestrictedMedia {
    mediaId: Uuid;
    mediaSlug: string;
    mediaType: MediaType;
    categoryId: Uuid;
    categoryName: string;
    categoryYear: number;
    categorySlug: string;
    roles: string[];
    isVisibleToYou: boolean;
}
