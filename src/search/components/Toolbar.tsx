import { ParentComponent, Show, children } from "solid-js";

import { searchGrid, searchList } from "../_routes";

import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../../_components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink href={searchGrid.absolutePath} route={searchGrid} />
            <ToolbarLink href={searchList.absolutePath} route={searchList} />

            <Show when={!!c()}>
                <ToolbarDivider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
