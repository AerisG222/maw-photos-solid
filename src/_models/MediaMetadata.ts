export interface ExifTag {
    desc: string;
    val: string;
}

// metadata is grouped into named sections (tabs), each a set of exif tags
export type MediaMetadata = Record<string, Record<string, ExifTag>>;
