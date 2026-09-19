import { ParentComponent, children } from "solid-js";
import { useBarTooltips } from "../tooltip/TooltipPlacement";

const SidebarLayout: ParentComponent = props => {
    const c = children(() => props.children);
    // down the right edge from `md` up, so tooltips open inwards; along the
    // bottom below it, so upwards
    const tooltips = useBarTooltips("left", "top");

    return (
        <div
            class="flex md:flex-col chrome-glass z-20 border-l-1 border-l-base-content/20"
            {...tooltips()}
        >
            {c()}
        </div>
    );
};

export default SidebarLayout;
