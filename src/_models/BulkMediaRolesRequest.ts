import { Uuid } from "./Uuid";

export interface BulkMediaRolesRequest {
    mediaIds: Uuid[];
    roles: string[];
}
