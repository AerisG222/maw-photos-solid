import { ParentComponent, children } from 'solid-js';

type Props = {
    title: string;
}

const Panel: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <>
            <div class="border-1 border-primary:50% border-rounded-1 p-1 min-w-300px max-w-500px">
            <h2 class="head2">{props.title}</h2>
                {c()}
            </div>
        </>
    );
};

export default Panel;
