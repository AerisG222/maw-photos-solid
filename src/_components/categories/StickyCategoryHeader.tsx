import { Component } from "solid-js";

import { Category } from "../../_models/Category";

import CategoryBreadcrumb from "./CategoryBreadcrumb";

interface Props {
    category?: Category;
    showTitleAsLink?: boolean;
}

/*
   The year and the category's name, held at the top of the scroller while its
   photos are on screen - so where you are, and the year link back out of it,
   stay in reach however far down the grid you are.

   It sticks within its parent's box, so it leaves with that box.
*/
const StickyCategoryHeader: Component<Props> = props => (
    <header class="sticky top-0 z-20 bg-base-100/90 backdrop-blur-sm py-1 border-b border-base-content/10">
        <CategoryBreadcrumb showTitleAsLink={props.showTitleAsLink} category={props.category} />
    </header>
);

export default StickyCategoryHeader;
