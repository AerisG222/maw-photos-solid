import { Uuid } from '../../../_models/Uuid';

export interface CategoryIdsForYearResult {
    year: number;
    categoryIds: Uuid[];
}
