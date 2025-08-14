export type Comment = {
    commentId: Uuid;
    created: Date;
    createdBy: string;
    modified: Date;
    body: string;
};
