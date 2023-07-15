import { ApiCollection } from '../../_api/_models/ApiCollection';
import { Comment } from '../../_api/_models/Comment';

export interface ICommentService {
    fetchComments: (id: number) => Promise<ApiCollection<Comment>>;
    addComment: (id: number, comment: text) => Promise<Response>;
}
