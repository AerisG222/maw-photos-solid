import { ParentComponent, Show, children } from "solid-js";

import { searchGrid, searchList } from "./_routes";

import ToolbarDivider from "../components/toolbar/ToolbarDivider";
import ToolbarLayout from "../components/toolbar/ToolbarLayout";
import ToolbarLink from "../components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink route={searchGrid} />
            <ToolbarLink route={searchList} />

            <Show when={!!c()}>
                <ToolbarDivider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
