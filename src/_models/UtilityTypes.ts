import { Category } from "./Category";

export interface FilterFunction {
    name: string;
    filterFn: (a: Category) => boolean;
}

export interface SortFunction {
    name: string;
    sortFn: (a: Category, b: Category) => number;
}
