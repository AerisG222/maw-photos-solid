import { ParentComponent, children } from 'solid-js';

const StatLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div class="grid grid-rows-[max-content_auto] h-[calc(100vh-.25rem)]">
            {c()}
        </div>
    );
}

export default StatLayout;
