import { JSXElement, ParentComponent, Show, children } from 'solid-js'

import { MarginIdType, getMarginClass } from '../../models/Margin';

interface Props {
    title?: string;
    margin?: MarginIdType;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
}

const Layout: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    return (
        <div class="grid
            grid-rows-[max-content_auto_max-content] grid-cols-[100vw]
            md:grid-rows-[100vh] md:grid-cols-[max-content_auto_max-content]"
        >
            <Show when={props.toolbar} fallback={<div />}>
                {props.toolbar}
            </Show>

            <div class="overflow-y-auto px-2">
                <div classList={getMarginClass(props.margin)}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {c()}
                </div>
            </div>

            <Show when={props.sidebar} fallback={<div />}>
                {props.sidebar}
            </Show>
        </div>
    );
};

export default Layout;
