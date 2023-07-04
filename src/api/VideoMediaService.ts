import { IRatingService } from '../models/services/IRatingService';
import { setTeaser } from './VideoCategories';
import { addComment, getComments, getGpsDetail, getRating, rateVideo, setGpsCoordinateOverride } from './Videos';
import { ICommentService } from '../models/services/ICommentService';
import { ICategoryTeaserService } from '../models/services/ICategoryTeaserService';
import { IMetadataEditService } from '../models/services/IMetadataEditService';

export class VideoMediaService
    implements
        IRatingService,
        ICommentService,
        ICategoryTeaserService,
        IMetadataEditService {
    fetchRating = getRating;
    setRating = rateVideo;
    fetchComments = getComments;
    addComment = addComment;
    setTeaser = setTeaser;
    fetchGpsDetail = getGpsDetail;
    setGpsCoordinateOverride = setGpsCoordinateOverride;
}
