import { Uuid } from './Uuid';
import { Media } from "./Media";

export interface Category {
    id: Uuid;
    name: string;
    effectiveDate: Date;
    modified: Date;
    isFavorite: boolean;
    teaser: Media;
}
