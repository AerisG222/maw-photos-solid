import { ParentComponent, children } from 'solid-js'

const ToolbarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col bg-base-200 border-r-1 border-r-secondary-content:10%">
            {c()}
        </div>
    );
};

export default ToolbarLayout;
