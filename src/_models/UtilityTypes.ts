import { Category } from './Category';

export type FilterFunction = {
    name: string;
    filterFn: (a: any) => boolean;
};

export type SortFunction = {
    name: string;
    sortFn: (a: Category, b: Category) => number;
};
