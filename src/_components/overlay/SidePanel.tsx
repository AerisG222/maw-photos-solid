import { JSXElement, ParentComponent, Show, createEffect, onCleanup } from "solid-js";

import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";

import Icon from "../icon/Icon";

/*
   Which of the three shapes a panel is wearing.

   Exported because a caller has to answer the same question about its own
   chrome: the rail that opens a panel is *underneath* it in both overlaid
   shapes, so whatever the rail offers has to move into the panel there.
*/
export const usePanelShape = () => {
    const [, { gteMd, gteLg }] = useMediaBreakpointContext();

    // beside the content only where there is room for both of them
    return { docked: () => gteLg(), gteMd };
};

interface Props {
    open: boolean;
    onClose: () => void;
    // named in the header, which only the overlaid shapes draw
    title: string;
    /*
       A row of controls pinned under the header - the Inspector's card chooser.
       Pinned rather than scrolled with the content because it is how you change
       what the content *is*, and it was scrolling away.
    */
    chooser?: JSXElement;
}

/*
   A panel beside the content, over it, or up from the bottom of it.

   Wide enough for both and it sits alongside; narrower and it comes over the
   right-hand side; on a phone it rises from the bottom. This was the
   Inspector's alone, and bulk edit had a second copy of the thing the Inspector
   used to be - a hard `w-[500px]` in the layout's sidebar slot, which on a
   390px viewport is a panel wider than the screen sitting *in flow*, stretching
   the bottom row to its own height and pushing the chrome around.

   The header is the part worth being deliberate about. Overlaid, this covers
   the rail that opened it, so the control you would reach for to close it is
   beneath the thing you want to close. Docked, nothing is covered and there is
   nothing to say - so the header is not drawn at all.
*/
const SidePanel: ParentComponent<Props> = props => {
    const { docked, gteMd } = usePanelShape();

    /*
       Escape closes it, but only where it is covering something. Docked it is
       part of the page and Escape belongs to whatever else wants it.
    */
    createEffect(() => {
        if (!props.open || docked()) {
            return;
        }

        const onKeyDown = (evt: KeyboardEvent) => {
            if (evt.key === "Escape") {
                evt.preventDefault();
                props.onClose();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        onCleanup(() => window.removeEventListener("keydown", onKeyDown));
    });

    return (
        <>
            {/*
                Dismisses on a tap outside, which is the gesture anything
                covering the page has to answer. Docked there is nothing to
                dismiss.
            */}
            <Show when={props.open && !docked()}>
                <div
                    class="fixed inset-0 z-30 bg-base-300/60"
                    onClick={() => props.onClose()}
                    aria-hidden="true"
                />
            </Show>

            <Show when={props.open}>
                <div
                    role={docked() ? "complementary" : "dialog"}
                    aria-label={props.title}
                    aria-modal={docked() ? undefined : "false"}
                    class="flex min-h-0 flex-col bg-base-200 border-base-content/30"
                    classList={{
                        "w-[500px] border-l-1": docked(),
                        "fixed z-40 inset-y-0 right-0 w-[min(500px,80vw)] border-l-1 elev-overlay":
                            !docked() && gteMd(),
                        "fixed z-40 inset-x-0 bottom-0 h-[70dvh] rounded-t-box border-t-1 elev-overlay":
                            !docked() && !gteMd()
                    }}
                >
                    <Show when={!docked()}>
                        <div class="flex shrink-0 items-center justify-between border-b-1 border-b-base-content/20 px-4 py-2">
                            <span class="text-label">{props.title}</span>

                            <button
                                class="cursor-pointer p-1 hover:text-primary"
                                onClick={() => props.onClose()}
                                aria-label={`Close ${props.title}`}
                                title={`Close ${props.title}`}
                            >
                                <Icon classes="icon-[ic--round-close] text-lg" />
                            </button>
                        </div>
                    </Show>

                    <Show when={props.chooser && !docked()}>
                        <div class="flex shrink-0 overflow-x-auto border-b-1 border-b-base-content/20">
                            {props.chooser}
                        </div>
                    </Show>

                    <div class="min-h-0 grow overflow-x-hidden overflow-y-auto">
                        {props.children}
                    </div>
                </div>
            </Show>
        </>
    );
};

export default SidePanel;
