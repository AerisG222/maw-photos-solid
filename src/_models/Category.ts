import { parseISO } from "date-fns";

import { Uuid } from "./Uuid";
import { Media } from "./Media";
import { MediaType } from './MediaType';

export interface Category {
    id: Uuid;
    year: number;
    slug: string;
    name: string;
    effectiveDate: Date;
    modified: Date;
    isFavorite: boolean;
    teaser: Media;
    mediaTypes: MediaType[];
}

// Wire shape as returned by the API: dates arrive as ISO strings (JSON has no
// Date type). Use `mapCategory` to convert a DTO into a domain `Category`.
export interface CategoryDto extends Omit<Category, "effectiveDate" | "modified"> {
    effectiveDate: string;
    modified: string;
}

export const mapCategory = (dto: CategoryDto): Category => ({
    ...dto,
    effectiveDate: parseISO(dto.effectiveDate),
    modified: parseISO(dto.modified)
});
