import { Uuid } from "./Uuid";

export interface CreateClanRequest {
    name: string;
    personIds: Uuid[];
}

export interface RenameClanRequest {
    id: Uuid;
    name: string;
}

// the whole membership rather than a delta: the picker already knows the full
// set, which makes the call idempotent and means a lost response cannot leave a
// clan half updated
export interface SetClanPersonsRequest {
    id: Uuid;
    personIds: Uuid[];
}
