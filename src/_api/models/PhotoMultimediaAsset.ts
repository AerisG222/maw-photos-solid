import { MultimediaAsset } from "./MultimediaAsset";

export type PhotoMultimediaAsset = MultimediaAsset & {
    downloadUrl: string;
};
