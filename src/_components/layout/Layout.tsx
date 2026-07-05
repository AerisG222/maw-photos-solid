import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import { MarginIdType, getMarginClass } from "../../_models/Margin";

interface Props {
    xPad?: boolean;
    // fill: the page manages its own height (e.g. media detail). The content
    // area fills its cell and does not scroll, so children can distribute the
    // available space with flex/grid instead of computing pixel offsets.
    fill?: boolean;
    title?: string;
    margin?: MarginIdType;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
}

const Layout: ParentComponent<Props> = props => {
    const merged = mergeProps({ xPad: true }, props);
    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);

    return (
        <div
            class="grid w-full h-full min-h-0
            grid-rows-[max-content_minmax(0,1fr)_0] grid-cols-[100%]
            md:grid-rows-[100%] md:grid-cols-[max-content_minmax(0,1fr)_max-content]"
        >
            <Show when={toolbar()} fallback={<div />}>
                {toolbar()}
            </Show>

            <div
                class="scrollable"
                classList={{
                    "px-2": merged.xPad,
                    "overflow-y-auto": !merged.fill,
                    "h-full min-h-0 overflow-hidden": !!merged.fill
                }}
            >
                <div classList={{ ...(getMarginClass(props.margin) ?? {}), "h-full": !!merged.fill }}>
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
