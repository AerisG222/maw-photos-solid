import { Uuid } from "./Uuid";
import { MediaFile } from "./MediaFile";
import { MediaType } from './MediaType';

export interface Media {
    id: Uuid;
    slug: string;
    categoryId: Uuid;
    categoryYear: number;
    categorySlug: string;
    type: MediaType;
    isFavorite: boolean;
    files: MediaFile[];
}
