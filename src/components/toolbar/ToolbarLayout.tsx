import { ParentComponent, children } from "solid-js"

const ToolbarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col bg-base-200 border-r-1 border-r-base-content:20%">
            {c()}
        </div>
    );
};

export default ToolbarLayout;
