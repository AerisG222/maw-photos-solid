import { ICategory } from './Category';

export type YearFilterIdType = number | string;
export const allYearFilterId = 'all';

export const yearFilterPredicate = (c: ICategory, year: YearFilterIdType) =>
    year === allYearFilterId || year === c.year;
