import { setTeaser } from "../../_api/Categories";
import {
    addComment,
    getComments,
    getExifData,
    getGpsDetail,
    setIsFavorite,
    setGpsCoordinateOverride
} from "../../_api/Media";
import { IFavoriteService } from "./IFavoriteService";
import { ICommentService } from "./ICommentService";
import { IExifService } from "./IExifService";
import { ICategoryTeaserService } from "./ICategoryTeaserService";
import { IMetadataEditService } from "./IMetadataEditService";

export class MediaService
    implements
    IFavoriteService,
    ICommentService,
    IExifService,
    ICategoryTeaserService,
    IMetadataEditService {
    setIsFavorite = setIsFavorite;
    fetchComments = getComments;
    addComment = addComment;
    fetchExif = getExifData;
    setTeaser = setTeaser;
    fetchGpsDetail = getGpsDetail;
    setGpsCoordinateOverride = setGpsCoordinateOverride;
}

export const mediaService = new MediaService();
