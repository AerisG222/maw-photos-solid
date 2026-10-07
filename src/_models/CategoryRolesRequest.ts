import { Uuid } from "./Uuid";

// the whole set of roles, not a delta - see the route in maw-media
export interface CategoryRolesRequest {
    categoryId: Uuid;
    roles: string[];
}
