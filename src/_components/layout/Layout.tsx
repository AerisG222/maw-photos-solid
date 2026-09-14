import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import { useFullscreenContext } from "../../_contexts/FullscreenContext";

interface Props {
    xPad?: boolean;
    // fill: the page manages its own height (e.g. media detail). The content
    // area fills its cell and does not scroll, so children can distribute the
    // available space with flex/grid instead of computing pixel offsets.
    fill?: boolean;
    title?: string;
    /*
       Rendered where the title would be, for a screen whose heading is a
       component rather than a string - the place chain, which names where you
       are *and* is the way back out of it. A screen passes one or the other,
       never both: they answer the same question.
    */
    header?: JSXElement;
    /*
       Cap how wide the content runs.

       A flag rather than a value. It was a value once - seven listing screens
       each read a margin from their own settings store and handed it down, all
       seven deriving it from the same density - and then a density step, and
       now simply one width. What was never uniform is *which* screens want it:
       a listing breathes, a settings form does not.
    */
    margin?: boolean;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
}

const Layout: ParentComponent<Props> = props => {
    const merged = mergeProps({ xPad: true }, props);

    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);
    const header = children(() => props.header);
    /*
       Fullscreen takes the chrome away entirely rather than fading it.

       This used to hide it on an idle timer, for a fullscreen *view* that still
       drew a toolbar and a rail around the photograph. There is no such view
       now - fullscreen is a state the grid enters, and in it the photograph is
       the whole screen. Nothing to dim, nothing to keep up under a resting
       pointer, and one button to leave by.
    */
    const [fullscreen] = useFullscreenContext();

    return (
        <div
            /*
               Three slots: chrome, content, inspector rail.

               From `md` up they are three columns - rail, page, rail. Below it
               the content takes the whole upper area and the two strips share
               one row along the bottom, which is where a thumb is. The chrome
               used to sit along the top on a phone, and the Inspector's row was
               a literal `0`: a blunt way of saying it does not exist there,
               which it did not, because it was a fixed 500px column.

               Each slot is placed explicitly rather than by source order,
               because the two orders differ. The chrome comes first in the DOM
               so the tab order and a screen reader reach the navigation before
               the page, and last on screen on a phone.
            */
            class="grid w-full h-full min-h-0
            grid-rows-[minmax(0,1fr)_max-content] grid-cols-[minmax(0,1fr)_max-content]
            md:grid-rows-[100%] md:grid-cols-[max-content_minmax(0,1fr)_max-content]"
        >
            <Show when={!fullscreen.isFullscreen}>
                <div class="row-start-2 col-start-1 md:row-start-1 md:col-start-1 flex">
                    {toolbar()}
                </div>
            </Show>

            <div
                class="stage-backdrop row-start-1 col-span-2 md:row-start-1 md:col-start-2 md:col-span-1"
                classList={{
                    "px-2": merged.xPad,
                    "overflow-y-auto": !merged.fill,
                    "h-full min-h-0 overflow-hidden": !!merged.fill
                }}
            >
                <div classList={{ stage: !!props.margin, "h-full": !!merged.fill }}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {header()}

                    {content()}
                </div>
            </div>

            <Show when={!fullscreen.isFullscreen}>
                <div class="row-start-2 col-start-2 md:row-start-1 md:col-start-3 flex">
                    {sidebar()}
                </div>
            </Show>
        </div>
    );
};

export default Layout;
