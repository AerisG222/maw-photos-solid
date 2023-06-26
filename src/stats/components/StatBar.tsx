import { ParentComponent, children } from 'solid-js';

const StatBar: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <>
            <div class="stats shadow w-[100%]">
                {c()}
            </div>
        </>
    );
}

export default StatBar;
