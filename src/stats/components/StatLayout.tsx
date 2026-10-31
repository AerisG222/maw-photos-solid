import { ParentComponent, children } from "solid-js";

const StatLayout: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        /*
           A column no wider than the page, rather than as wide as its widest child.
           The treemap sizes itself to its row, so the row keeps a usable height on a
           phone, where the stat boxes above it stack.
        */
        <div class="grid grid-cols-[minmax(0,1fr)] grid-rows-[max-content_max-content_minmax(25rem,1fr)] h-[calc(100dvh-.25rem)]">
            {c()}
        </div>
    );
};

export default StatLayout;
