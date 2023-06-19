import { IRatingService } from './IRatingService';

import { addComment, getComments, getExifData, getRating, ratePhoto } from '../api/Photos';
import { ICommentService } from './ICommentService';
import { IExifService } from './IExifService';

export class PhotoMediaService implements IRatingService, ICommentService, IExifService {
    fetchRating = getRating;
    setRating = ratePhoto;
    fetchComments = getComments;
    addComment = addComment
    fetchExif = getExifData
}
