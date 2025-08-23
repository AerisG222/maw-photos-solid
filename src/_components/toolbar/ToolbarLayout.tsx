import { ParentComponent, children } from "solid-js";

import ToolbarCollapseButton from "./ToolbarCollapseButton";

const ToolbarLayout: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <div
            class="flex bg-base-200  border-t-1 border-t-base-content/20
                md:flex-col md:border-t-0 md:border-r-1 md:border-r-base-content/20"
        >
            {c()}

            <span class="grow" />

            <div class="divider my-0 h-auto"></div>

            <ToolbarCollapseButton />
        </div>
    );
};

export default ToolbarLayout;
