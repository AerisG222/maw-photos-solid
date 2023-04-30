import { ParentComponent, children } from "solid-js";

const SidebarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col bg-secondary-content:12 border-l-1 border-l-secondary-content:10%">
            {c()}
        </div>
    );
};

export default SidebarLayout;
