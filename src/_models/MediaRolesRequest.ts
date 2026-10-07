import { Uuid } from "./Uuid";

// the whole restriction, not a delta - see the route in maw-media
export interface MediaRolesRequest {
    mediaId: Uuid;
    roles: string[];
}
