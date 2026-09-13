import { JSXElement, ParentComponent, Show, children, mergeProps } from "solid-js";

import { getMarginClass } from "../../_models/Margin";
import { getDensityMargin } from "../../_models/Density";
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
}

const Layout: ParentComponent<Props> = props => {
    const merged = mergeProps({ xPad: true }, props);
    const [listing] = useListingSettingsContext();
    const margin = () => (props.margin ? getDensityMargin(listing.density) : undefined);
    const content = children(() => props.children);
    const toolbar = children(() => props.toolbar);
    const sidebar = children(() => props.sidebar);
    const header = children(() => props.header);

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
                class="stage-backdrop"
                classList={{
                    "px-2": merged.xPad,
                    "overflow-y-auto": !merged.fill,
                    "h-full min-h-0 overflow-hidden": !!merged.fill
                }}
            >
                <div classList={{ ...(getMarginClass(margin()) ?? {}), "h-full": !!merged.fill }}>
                    <Show when={!!props.title}>
                        <h1 class="head1">{props.title}</h1>
                    </Show>

                    {header()}

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
