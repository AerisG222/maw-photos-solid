import { ParentComponent, children } from 'solid-js';

const Panel: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <>
            <div class="flex flex-wrap flex-gap4">
                {c()}
            </div>
        </>
    );
}

export default Panel;
