import { Category } from "./Category";

export interface FilterFunction {
    name: string;
    filterFn: (a: any) => boolean;
}

export interface SortFunction {
    name: string;
    sortFn: (a: Category, b: Category) => number;
}
