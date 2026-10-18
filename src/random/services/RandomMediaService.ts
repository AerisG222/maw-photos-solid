import { PagedMediaService } from "../../_media/services/PagedMediaService";
import { Media } from "../../_models/Media";
import { MediaView } from "../../_models/MediaView";
import { IMediaService } from "../../_media/services/IMediaService";
import { gridView, randomGridLink } from "../_routes";

export class RandomMediaService extends PagedMediaService<Media[]> implements IMediaService {
    protected pageMedia(page: Media[]) {
        return page;
    }

    // one view - the grid - so the view asked for only matters once there are more
    getEntryLinkByView = (_view: MediaView) => randomGridLink();

    getMediaLinkByView = (_view: MediaView, media: Media | undefined) => randomGridLink(media);

    getAvailableViews = () => [gridView];

    override canRequestMore = () => true;
}
