import { ParentComponent, children } from "solid-js";

const SidebarLayout: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col chrome-glass z-20 border-l-1 border-l-base-content/20">
            {c()}
        </div>
    );
};

export default SidebarLayout;
