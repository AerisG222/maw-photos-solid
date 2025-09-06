import { Uuid } from './Uuid';

export type AddCommentRequest = {
    mediaId: Uuid;
    comment: string;
};
