import { MediaFile } from "./MediaFile";

export type Media = {
    id: Uuid;
    categoryId: Uuid;
    type: MediaType;
    isFavorite: boolean;
    files: MediaFile[];
};
