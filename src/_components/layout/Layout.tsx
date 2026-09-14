import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import { getStageClass } from "../../_models/Margin";
import { createIdleChrome } from "./_idleChrome";
import { useListingSettingsContext } from "../../_contexts/settings/ListingSettingsContext";

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
       Indent the content, by however much the density asks for.

       A flag rather than a value: seven listing screens were each reading a
       margin from their own settings store and handing it down, and all seven
       were deriving it from the same one number. What was never uniform is
       *which* screens want it - a listing breathes, a settings form does not -
       so that part stays a decision each screen makes.
    */
    margin?: boolean;
    toolbar?: JSXElement;
    sidebar?: JSXElement;
    /*
       Let the chrome step back while nothing is happening. Asked for by the
       fullscreen view, whose whole point is the photograph, and by nothing
       else: on a page you are reading rather than looking at, chrome that
       disappears is chrome you have to go looking for.
    */
    autoHideChrome?: boolean;
}

const Layout: ParentComponent<Props> = props => {
    const merged = mergeProps({ xPad: true }, props);
    const [listing] = useListingSettingsContext();
    const stage = () => (props.margin ? getStageClass(listing.density) : "");
    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);
    const header = children(() => props.header);
    const chrome = createIdleChrome(() => !!props.autoHideChrome);

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
            <div
                class="row-start-2 col-start-1 md:row-start-1 md:col-start-1 flex transition-[opacity,width] duration-300 ease-out"
                classList={{
                    // collapsed as well as faded, so the photograph takes the
                    // room back rather than the strip sitting there empty
                    "opacity-0 pointer-events-none md:w-0 md:overflow-hidden": chrome.hidden()
                }}
                onPointerEnter={chrome.hold}
                onPointerLeave={chrome.release}
                onFocusIn={chrome.hold}
                onFocusOut={chrome.release}
            >
                {toolbar()}
            </div>

            <div
                class="stage-backdrop row-start-1 col-span-2 md:row-start-1 md:col-start-2 md:col-span-1"
                classList={{
                    "px-2": merged.xPad,
                    "overflow-y-auto": !merged.fill,
                    "h-full min-h-0 overflow-hidden": !!merged.fill
                }}
            >
                <div class={stage()} classList={{ "h-full": !!merged.fill }}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {header()}

                    {content()}
                </div>
            </div>

            <div
                class="row-start-2 col-start-2 md:row-start-1 md:col-start-3 flex transition-[opacity,width] duration-300 ease-out"
                classList={{
                    // collapsed as well as faded, so the photograph takes the
                    // room back rather than the strip sitting there empty
                    "opacity-0 pointer-events-none md:w-0 md:overflow-hidden": chrome.hidden()
                }}
                onPointerEnter={chrome.hold}
                onPointerLeave={chrome.release}
                onFocusIn={chrome.hold}
                onFocusOut={chrome.release}
            >
                {sidebar()}
            </div>
        </div>
    );
};

export default Layout;
