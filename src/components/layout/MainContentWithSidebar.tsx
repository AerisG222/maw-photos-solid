import { JSXElement, ParentComponent, Show, children } from 'solid-js'
import { MarginIdType, getMarginClass } from '../../models/Margin';

interface Props {
    title?: string;
    margin?: MarginIdType;
    sidebar: JSXElement;
}

// todo: consolidate w/ maincontent?
const MainContentWithSidebar: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <div class="grid
            grid-rows-[max-content_auto] grid-cols-[100vw]
            md:grid-rows-[100vh] md:grid-cols-[auto_max-content]">
            <div class="overflow-y-auto pl-2 pr-2 pb-8">
                <div classList={getMarginClass(props.margin)}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {c()}
                </div>
            </div>
            <div>
                {props.sidebar}
            </div>
        </div>
    );
};

export default MainContentWithSidebar;
