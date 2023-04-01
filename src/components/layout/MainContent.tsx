import { ParentComponent, children } from 'solid-js'

interface Props {
    title: string;
}

const MainContent: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <div class="overflow-y-auto pb-8">
            <h1 class="head1">{props.title}</h1>
            {c()}
        </div>
    );
};

export default MainContent;
