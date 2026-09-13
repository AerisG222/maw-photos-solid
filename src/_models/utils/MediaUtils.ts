import { Media } from "../Media";
import { ThumbnailSizeIdType } from "../ThumbnailSize";

export const getMediaTeaserUrl = (media: Media, _size: ThumbnailSizeIdType) => {
    // sizes offered today are all qqvg or smaller, so no need to search for best res at this time
    if (media.type === "photo") {
        return media.files.find(f => f.scale === "qqvg-fill")?.path;
    } else {
        return media.files.find(f => f.scale === "qqvg-fill" && f.type === "video-poster")?.path;
    }
};

export const getMediaShareUrl = (_media: Media) => "TODO";

/*
   A seed for a shuffled feed.

   Postgres takes it as a bigint, but it only has to be stable and varied - a 32
   bit value is plenty and stays exact in a javascript number. The order is a
   function of the seed, so paging through a shuffle keeps its place instead of
   repeating and skipping rows.
*/
export const newMediaSeed = () => Math.floor(Math.random() * 2 ** 31);

/*
   A download needs a name. The url's last segment is the file's own, with a
   suffix so the two resolutions of one photograph do not overwrite each other
   in a downloads folder.
*/
export const getFilenameFromUrl = (url: string, suffix?: string) => {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const filename = path.substring(path.lastIndexOf("/") + 1) || "download";

        return getFilenameWithSuffix(filename, suffix);
    } catch {
        return suffix ? `download-${suffix}` : "download";
    }
};

const getFilenameWithSuffix = (filename: string, suffix?: string) => {
    const extIndex = filename.lastIndexOf(".");

    return extIndex === -1
        ? filename
        : `${filename.substring(0, extIndex)}-${suffix}${filename.substring(extIndex)}`;
};
