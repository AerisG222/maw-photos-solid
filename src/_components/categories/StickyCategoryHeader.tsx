import { Component } from "solid-js";

import { Category } from "../../_models/Category";

import StickyHeader from "../layout/StickyHeader";
import CategoryBreadcrumb from "./CategoryBreadcrumb";

interface Props {
    category?: Category;
    showTitleAsLink?: boolean;
}

// the year and the category's name, with the year as the link back out of it
const StickyCategoryHeader: Component<Props> = props => (
    <StickyHeader>
        <CategoryBreadcrumb showTitleAsLink={props.showTitleAsLink} category={props.category} />
    </StickyHeader>
);

export default StickyCategoryHeader;
