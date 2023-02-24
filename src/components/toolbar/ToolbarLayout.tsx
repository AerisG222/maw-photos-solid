import { ParentComponent, children } from 'solid-js'

const ToolbarLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="flex md:flex-col">
            {c()}
        </div>
    );
};

export default ToolbarLayout;
