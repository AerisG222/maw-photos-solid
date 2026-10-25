import { ParentComponent, Show, children } from "solid-js";

import CategoriesNav from "./CategoriesNav";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout nav={<CategoriesNav />}>
            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
