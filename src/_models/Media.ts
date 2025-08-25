import { MediaFile } from "./MediaFile";

export type Media = {
    latitude: any;
    longitude: any;
    id: Uuid;
    categoryId: Uuid;
    type: MediaType;
    isFavorite: boolean;
    files: MediaFile[];
};
