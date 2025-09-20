import { Category } from "../../../_models/Category";

export interface CategoriesForYearResult {
    year: number;
    categories: Category[];
}
