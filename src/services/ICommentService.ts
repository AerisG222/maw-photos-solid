export interface ICommentService {
    fetchComments: (id: number) => void;
    addComment: (id: number, comment: text) => void;
}
