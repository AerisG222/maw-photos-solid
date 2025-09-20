import { Uuid } from "./Uuid";
import { MediaTypeStat } from "./MediaTypeStat";

export interface CategoryStat {
    categoryId: Uuid;
    categoryName: string;
    mediaTypeStats: MediaTypeStat[];
}
