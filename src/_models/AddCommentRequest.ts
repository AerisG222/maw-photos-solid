import { Uuid } from "./Uuid";

export interface AddCommentRequest {
    mediaId: Uuid;
    comment: string;
}
