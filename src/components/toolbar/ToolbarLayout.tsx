import { ParentComponent, children } from "solid-js"

const ToolbarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex bg-base-200  border-t-1 border-t-base-content:20%
                md:flex-col md:border-r-1 md:border-r-base-content:20%">
            {c()}
        </div>
    );
};

export default ToolbarLayout;
