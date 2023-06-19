import { IRatingService } from './IRatingService';

import { addComment, getComments, getExifData, getGpsDetail, getRating, ratePhoto, setGpsCoordinateOverride } from '../api/Photos';
import { ICommentService } from './ICommentService';
import { IExifService } from './IExifService';
import { setTeaser } from '../api/PhotoCategories';
import { ICategoryTeaserService } from './ICategoryTeaserService';
import { IMetadataEditService } from './IMetadataEditService';

export class PhotoMediaService
    implements
        IRatingService,
        ICommentService,
        IExifService,
        ICategoryTeaserService,
        IMetadataEditService {
    fetchRating = getRating;
    setRating = ratePhoto;
    fetchComments = getComments;
    addComment = addComment;
    fetchExif = getExifData;
    setTeaser = setTeaser;
    fetchGpsDetail = getGpsDetail;
    setGpsCoordinateOverride = setGpsCoordinateOverride;
}