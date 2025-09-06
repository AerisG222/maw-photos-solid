import { Uuid } from './Uuid';
import { MediaTypeStat } from "./MediaTypeStat";

export type CategoryStat = {
    categoryId: Uuid;
    categoryName: string;
    mediaTypeStats: MediaTypeStat[];
};
