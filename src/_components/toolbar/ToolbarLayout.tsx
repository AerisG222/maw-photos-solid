import { JSXElement, ParentComponent, Show, children, createSignal } from "solid-js";

import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";

import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";
import ToolbarCollapseButton from "./ToolbarCollapseButton";
import { useBarTooltips } from "../tooltip/TooltipPlacement";

interface Props {
    /*
       The view switcher. Always on screen, at every width - it is how you get
       anywhere, so it is the one thing that never goes behind a tap.
    */
    nav?: JSXElement;
    // the `⋮` menu, which stays out too: it is already a single button
    actions?: JSXElement;
}

/*
   The chrome: a rail down the left from `md` up, a bar across the bottom below
   it.

   A phone used to get the same flat row of every control the desktop shows,
   laid out horizontally with no strategy for running out of room - a media view
   offers around a dozen, which on a 390px screen is either a squeeze or a
   silent overflow. The application's answer had been to hide the other three
   views entirely below `md`, which solved the layout by removing the feature.

   So the bar keeps what you navigate with and folds the rest into a sheet. The
   children are rendered once either way; what changes is where they are put.
*/
const ToolbarLayout: ParentComponent<Props> = props => {
    const [, { gteMd }] = useMediaBreakpointContext();
    const [sheetOpen, setSheetOpen] = createSignal(false);
    // a column beside the page from `md` up, so tooltips open to the right; a
    // row along the bottom below it, so they open upwards, the only way with room
    const tooltips = useBarTooltips("right", "top");

    const c = children(() => props.children);
    const nav = children(() => props.nav);
    const actions = children(() => props.actions);

    return (
        <>
            {/*
                Deliberately not `role="toolbar"`. That role promises a single
                tab stop with the arrows moving between controls, and the roving
                cursor that delivered it has been removed - so claiming it would
                tell a screen reader to press keys that do nothing, which is
                worse than claiming nothing at all.
            */}
            <div
                class="flex chrome-glass z-20 border-t-1 border-t-base-content/20 md:flex-col md:border-t-0 md:border-t-transparent md:border-r-1 md:border-r-base-content/20"
                {...tooltips()}
            >
                <Show when={nav()}>{nav()}</Show>

                <Show when={actions()}>{actions()}</Show>

                {/*
                    Inline where there is room for it, behind a tap where there
                    is not. One `<Show>` rather than two rendered copies: the
                    same nodes move between the bar and the sheet.
                */}
                <Show when={c()}>
                    <Show
                        when={gteMd()}
                        fallback={
                            <Tooltip
                                as="button"
                                content="More controls"
                                class="flex items-center gap-1 px-3 py-2 cursor-pointer text-secondary hover:text-secondary-content hover:bg-secondary transition-colors duration-150 ease-out"
                                onClick={() => setSheetOpen(true)}
                                aria-label="More controls"
                                aria-expanded={sheetOpen()}
                            >
                                <Icon classes="icon-[ic--round-more-horiz] text-lg" />
                            </Tooltip>
                        }
                    >
                        {c()}
                    </Show>
                </Show>

                <span class="grow" />

                <div class="divider my-0 h-auto" />

                <ToolbarCollapseButton />
            </div>

            {/*
                Deliberately not a modal. These are toggles you flip while
                looking at what they change, so the sheet dims the page without
                taking it away, and stays open until it is dismissed.
            */}
            <Show when={sheetOpen() && !gteMd()}>
                <div
                    class="fixed inset-0 z-30 bg-base-300/60"
                    onClick={() => setSheetOpen(false)}
                    aria-hidden="true"
                />

                <div
                    role="dialog"
                    aria-modal="false"
                    aria-label="More controls"
                    class="fixed inset-x-0 bottom-0 z-40 max-h-[70dvh] overflow-y-auto
                        rounded-t-box border-t-1 border-t-base-content/20 bg-base-200 elev-overlay"
                >
                    <div class="flex items-center justify-between px-4 py-2">
                        <span class="text-label">More controls</span>

                        <button
                            class="cursor-pointer p-1 hover:text-primary"
                            onClick={() => setSheetOpen(false)}
                            aria-label="Close"
                        >
                            <Icon classes="icon-[ic--round-close] text-lg" />
                        </button>
                    </div>

                    <div class="flex flex-col pb-2">{c()}</div>
                </div>
            </Show>
        </>
    );
};

export default ToolbarLayout;
