import { setTeaser } from "../../_api/PhotoCategories";
import {
    addComment,
    getComments,
    getExifData,
    getGpsDetail,
    getRating,
    ratePhoto,
    setGpsCoordinateOverride
} from "../../_api/Photos";
import { IRatingService } from "./IRatingService";
import { ICommentService } from "./ICommentService";
import { IExifService } from "./IExifService";
import { ICategoryTeaserService } from "./ICategoryTeaserService";
import { IMetadataEditService } from "./IMetadataEditService";

export class PhotoMediaService
    implements
        IRatingService,
        ICommentService,
        IExifService,
        ICategoryTeaserService,
        IMetadataEditService
{
    fetchRating = getRating;
    setRating = ratePhoto;
    fetchComments = getComments;
    addComment = addComment;
    fetchExif = getExifData;
    setTeaser = setTeaser;
    fetchGpsDetail = getGpsDetail;
    setGpsCoordinateOverride = setGpsCoordinateOverride;
}

export const photoMediaService = new PhotoMediaService();
