import { ParentComponent, children } from "solid-js";

const Panel: ParentComponent = props => {
    const c = children(() => props.children);

    return <div class="flex flex-wrap gap-4 mb-4 justify-center">{c()}</div>;
};

export default Panel;
