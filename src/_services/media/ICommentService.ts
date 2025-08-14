import { Comment } from "../../_models/Comment";

export interface ICommentService {
    fetchComments: (id: Uuid) => Promise<Comment[]>;
    addComment: (id: Uuid, comment: string) => Promise<Response | undefined>;
}
