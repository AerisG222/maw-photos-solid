import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import { MarginIdType, getMarginClass } from "../../_models/Margin";

type Props = {
    xPad?: boolean;
    title?: string;
    margin?: MarginIdType;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
};

const Layout: ParentComponent<Props> = props => {
    const merged = mergeProps({ xPad: true }, props);
    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);

    return (
        <div
            class="grid w-full h-[calc(100vh-48px)]
            grid-rows-[max-content_auto_0] grid-cols-[100%]
            md:h-screen md:grid-rows-[100%] md:grid-cols-[max-content_auto_max-content]"
        >
            <Show when={toolbar()} fallback={<div />}>
                {toolbar()}
            </Show>

            <div class="overflow-y-auto scrollable" classList={{ "px-2": merged.xPad }}>
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
