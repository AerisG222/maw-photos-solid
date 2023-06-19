import { IRatingService } from './IRatingService';

import { addComment, getComments, getExifData, getRating, ratePhoto } from '../api/Photos';
import { ICommentService } from './ICommentService';
import { IExifService } from './IExifService';
import { setTeaser } from '../api/PhotoCategories';
import { ICategoryTeaserService } from './ICategoryTeaserService';

export class PhotoMediaService
    implements
        IRatingService,
        ICommentService,
        IExifService,
        ICategoryTeaserService {
    fetchRating = getRating;
    setRating = ratePhoto;
    fetchComments = getComments;
    addComment = addComment;
    fetchExif = getExifData;
    setTeaser = setTeaser;
}
