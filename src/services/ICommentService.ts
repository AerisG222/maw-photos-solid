import { ApiCollection } from '../api/models/ApiCollection';
import { Comment } from '../api/models/Comment';

export interface ICommentService {
    fetchComments: (id: number) => Promise<ApiCollection<Comment>>;
    addComment: (id: number, comment: text) => Promise<Response>;
}
