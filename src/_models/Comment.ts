import { parseISO } from "date-fns";

import { Uuid } from "./Uuid";

export interface Comment {
    commentId: Uuid;
    created: Date;
    createdBy: string;
    modified: Date;
    body: string;
}

// Wire shape as returned by the API: dates arrive as ISO strings (JSON has no
// Date type). Use `mapComment` to convert a DTO into a domain `Comment`.
export interface CommentDto extends Omit<Comment, "created" | "modified"> {
    created: string;
    modified: string;
}

export const mapComment = (dto: CommentDto): Comment => ({
    ...dto,
    created: parseISO(dto.created),
    modified: parseISO(dto.modified)
});
