import { ParentComponent, Show, children } from 'solid-js'
import { MarginIdType, getMarginClass } from '../../models/Margin';

interface Props {
    title?: string;
    margin?: MarginIdType;
}

const MainContent: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <div class="overflow-y-auto pl-2 pr-2 pb-8">
            <div classList={getMarginClass(props.margin)}>
                <Show when={!!props.title}>
                    <h1 class="head1">{props.title}</h1>
                </Show>

                {c()}
            </div>
        </div>
    );
};

export default MainContent;
