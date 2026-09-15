import { Media } from "../Media";
import { getCategoryPath } from "../../categories/_routes";

// one scale, so no size to choose between - see the note below
export const getMediaTeaserUrl = (media: Media) => {
    // sizes offered today are all qqvg or smaller, so no need to search for best res at this time
    if (media.type === "photo") {
        return media.files.find(f => f.scale === "qqvg-fill")?.path;
    } else {
        return media.files.find(f => f.scale === "qqvg-fill" && f.type === "video-poster")?.path;
    }
};

/*
   Where to send somebody so that they see this photograph.

   The application's address for it, not the file's. Every asset is served
   behind a bearer token the service worker attaches, so a link to one is
   meaningless to anybody who follows it - which is why this returned the string
   "TODO" for as long as it did. A link *into* the application works because the
   recipient signs in and the app fetches the file as them.

   The category's grid is the canonical home. The same photograph reached
   through a person's or a place's feed sits at a different path, but that path
   describes how you got there rather than where it is.

   Absolute, because a share sheet hands this to another application - and one
   resolved against wherever you are standing, so a link shared from the dev host
   points at the dev host.
*/
export const getMediaShareUrl = (media: Media) =>
    new URL(
        `${getCategoryPath(media.categoryYear, media.categorySlug)}/grid/${media.slug}`,
        window.location.origin
    ).href;

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
