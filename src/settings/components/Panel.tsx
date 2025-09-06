import { ParentComponent, children } from "solid-js";

interface Props {
    title: string;
}

const Panel: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    return (
        <div class="border-1 bg-base-200 border-secondary/40 rounded-md py-2 px-4 min-w-[300px] max-w-[500px]">
            <h2 class="head2">{props.title}</h2>
            {c()}
        </div>
    );
};

export default Panel;
