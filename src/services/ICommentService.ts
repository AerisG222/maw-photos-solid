import { ApiCollection } from '../models/api/ApiCollection';
import { Comment } from '../models/api/Comment';

export interface ICommentService {
    fetchComments: (id: number) => Promise<ApiCollection<Comment>>;
    addComment: (id: number, comment: text) => Promise<Response>;
}
