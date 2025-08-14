import { Media } from './Media';

export type Category = {
    id: Uuid,
    name: string,
    effectiveDate: Date,
    modified: Date,
    isFavorite: boolean,
    teaser: Media
};
