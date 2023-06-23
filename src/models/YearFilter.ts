import { Category } from './Category';

export type YearFilterIdType = number | string;
export const allYearFilterId = 'all';

export const yearFilterPredicate = (c: Category, year: YearFilterIdType) =>
    year === allYearFilterId || year === c.year;
