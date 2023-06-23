import { IRatingService } from '../models/services/IRatingService';

import { setTeaser } from './PhotoCategories';
import { addComment, getComments, getExifData, getGpsDetail, getRating, ratePhoto, setGpsCoordinateOverride } from './Photos';
import { ICommentService } from '../models/services/ICommentService';
import { IExifService } from '../models/services/IExifService';
import { ICategoryTeaserService } from '../models/services/ICategoryTeaserService';
import { IMetadataEditService } from '../models/services/IMetadataEditService';

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
