import { ParentComponent, children } from "solid-js";

const SidebarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col bg-secondary-content:12 border-r-1 border-r-secondary-content:10%">
            {c()}
        </div>
    );
};

export default SidebarLayout;
