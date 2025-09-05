import { Media } from "../Media";
import { ThumbnailSizeIdType } from "../ThumbnailSize";

export const getMediaTeaserUrl = (media: Media, size: ThumbnailSizeIdType) => {
    // sizes offered today are all qqvg or smaller, so no need to search for best res at this time
    if (media.type === "photo") {
        return media.files.find(f => f.scale === "qqvg-fill")?.path;
    } else {
        return media.files.find(f => f.scale === "qqvg-fill" && f.type === "video-poster")?.path;
    }
};

export const getMediaShareUrl = (media: Media) => "TODO";
