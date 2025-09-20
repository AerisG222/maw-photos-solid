import { Uuid } from "./Uuid";

export interface Comment {
    commentId: Uuid;
    created: Date;
    createdBy: string;
    modified: Date;
    body: string;
}
