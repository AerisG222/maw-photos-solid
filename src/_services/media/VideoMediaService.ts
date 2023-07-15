import { setTeaser } from '../../api/VideoCategories';
import { addComment, getComments, getGpsDetail, getRating, rateVideo, setGpsCoordinateOverride } from '../../api/Videos';
import { IRatingService } from './IRatingService';
import { ICommentService } from './ICommentService';
import { ICategoryTeaserService } from './ICategoryTeaserService';
import { IMetadataEditService } from './IMetadataEditService';

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
