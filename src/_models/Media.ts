import { MediaType, Uuid } from './Uuid';
import { MediaFile } from "./MediaFile";

export interface Media {
    latitude: any;
    longitude: any;
    id: Uuid;
    categoryId: Uuid;
    type: MediaType;
    isFavorite: boolean;
    files: MediaFile[];
}
