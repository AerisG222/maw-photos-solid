import { JSXElement, ParentComponent, Show, children } from 'solid-js'

import { MarginIdType, getMarginClass } from '../../models/Margin';
import { useLayoutOptionsContext } from '../../contexts/LayoutOptionsContext';

interface Props {
    title?: string;
    margin?: MarginIdType;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
}

const Layout: ParentComponent<Props> = (props) => {
    const [layoutOptions] = useLayoutOptionsContext();
    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);

    return (
        <div class="grid
            grid-rows-[max-content_auto_max-content] grid-cols-[100vw]
            md:grid-rows-[100vh] md:grid-cols-[max-content_auto_max-content]"
        >
            <Show when={toolbar()} fallback={<div />}>
                {toolbar()}
            </Show>

            <div class="overflow-y-auto" classList={{'px-2': layoutOptions.xPad}}>
                <div classList={getMarginClass(props.margin)}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {content()}
                </div>
            </div>

            <Show when={sidebar()} fallback={<div />}>
                {sidebar()}
            </Show>
        </div>
    );
};

export default Layout;
