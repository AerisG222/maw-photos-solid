import { ParentComponent } from 'solid-js';

const StatBar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <>
            <div class="stats shadow">
                {c()}
            </div>
        </>
    )
}

export default StatBar;
