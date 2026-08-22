import { parseISO } from "date-fns";

import { Person } from "./Person";
import { Uuid } from "./Uuid";

/*
   A saved selection of people, private to whoever created it, so "the kids" can
   be picked once rather than reassembled from the face grid each time.

   Members arrive as whole people - face url, media count, favorite flag - so a
   clan can be drawn with its faces without a second call. They are filtered by
   the same visibility rule the person list uses, which means a clan can hold
   fewer people than were saved into it, or none at all, when access changes.
*/
export interface Clan {
    id: Uuid;
    name: string;
    created: Date;
    modified: Date;
    members: Person[];
}

// wire shape as returned by the API: timestamps arrive as ISO strings
export interface ClanDto extends Omit<Clan, "created" | "modified"> {
    created: string;
    modified: string;
}

export const mapClan = (dto: ClanDto): Clan => ({
    ...dto,
    created: parseISO(dto.created),
    modified: parseISO(dto.modified)
});
