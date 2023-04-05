import { ParentComponent, children } from 'solid-js'

const ToolbarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col bg-secondary-content:8 border-r-1 border-r-primary:50%">
            {c()}
        </div>
    );
};

export default ToolbarLayout;
