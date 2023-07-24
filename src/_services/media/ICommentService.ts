import { ApiCollection } from '../../_api/models/ApiCollection';
import { Comment } from '../../_api/models/Comment';

export interface ICommentService {
    fetchComments: (id: number) => Promise<ApiCollection<Comment>>;
    addComment: (id: number, comment: string) => Promise<Response>;
}
