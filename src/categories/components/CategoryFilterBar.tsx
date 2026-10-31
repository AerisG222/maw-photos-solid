import { Component } from "solid-js";

import CategoriesFilterMenu from "./CategoriesFilterMenu";
import YearFilter from "./YearFilter";

// the year is which part of the library this is, so it stays out of the menu
const CategoryFilterBar: Component = () => (
    <>
        <YearFilter />
        <CategoriesFilterMenu />
    </>
);

export default CategoryFilterBar;
