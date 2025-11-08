import { Uuid } from "./Uuid";
import { Media } from "./Media";

export interface Category {
    id: Uuid;
    year: number;
    slug: string;
    name: string;
    effectiveDate: Date;
    modified: Date;
    isFavorite: boolean;
    teaser: Media;
}
