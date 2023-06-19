import { IRatingService } from './IRatingService';

import { addComment, getComments, getRating, ratePhoto } from '../api/Photos';
import { ICommentService } from './ICommentService';

export class PhotoMediaService implements IRatingService, ICommentService {
    fetchRating = getRating;
    setRating = ratePhoto;
    fetchComments = getComments;
    addComment = addComment
}
