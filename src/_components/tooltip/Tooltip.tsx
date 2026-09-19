import { JSX, Show, ValidComponent, createSignal, splitProps } from "solid-js";
import { Tooltip as KobalteTooltip, TooltipTriggerProps } from "@kobalte/core/tooltip";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

import { formatShortcut } from "../shortcuts/_util";
import { Placement, placementFromBar } from "./TooltipPlacement";

interface OwnProps {
    content: string;
    shortcutKeys?: string[];
    /*
       Which side of the control it opens on, flipping if there is no room.
       Usually left to the bar it stands in - see `useBarTooltips`.
    */
    placement?: Placement;
}

export type TooltipProps<T extends ValidComponent> = OwnProps &
    PolymorphicProps<T, TooltipTriggerProps<T>>;

/*
   The name of a control, shown on hover and on keyboard focus.

   This replaces `title` on the controls that are an icon and nothing else - the
   toolbars, the primary navigation and the Inspector rail. A `title` never
   appears on keyboard focus, so the shortcut hints were invisible to exactly
   the readers most likely to use them; it cannot be styled; and its delay is
   the browser's. Cards and content links keep `title`: there are thousands of
   them, and a native tooltip costs nothing per item.

   It *is* the control rather than wrapping it. Pass `as` - a tag or a component
   such as the router's `A` - and every other prop goes through to it, so the
   trigger's own handlers compose with the control's rather than one replacing
   the other. A click still does what it did, and closes the tooltip.

   Never on touch: a tap is not a hover, and a tooltip left open by one would
   cover the thing it describes. Kobalte ignores touch pointers here, which is
   one of the reasons it is used rather than the native popover API - hovering
   to open a popover is not yet something every browser can do without script.
*/
const Tooltip = <T extends ValidComponent = "button">(props: TooltipProps<T>): JSX.Element => {
    const [local, trigger] = splitProps(props as TooltipProps<"button">, [
        "content",
        "shortcutKeys",
        "placement"
    ]);

    /*
       What `title` used to tell a screen reader, said properly: the shortcut as
       `aria-keyshortcuts`, and the tooltip as a description wherever it says
       more than the control's name - "Toggle Labels" on a button named
       "Labels" - rather than repeating it.
    */
    const keyShortcuts = () =>
        local.shortcutKeys?.length ? local.shortcutKeys.join("+") : undefined;
    const description = () => (local.content !== trigger["aria-label"] ? local.content : undefined);

    // asked of the page each time it opens, since a bar turns at a breakpoint
    let el: HTMLElement | undefined;
    const [placement, setPlacement] = createSignal<Placement>("bottom");

    const onOpenChange = (open: boolean) => {
        if (open) {
            setPlacement(local.placement ?? placementFromBar(el) ?? "bottom");
        }
    };

    // the control's own ref, if it has one, still has to be told
    const setRef = (node: HTMLElement) => {
        el = node;

        const ref: unknown = trigger.ref;

        if (typeof ref === "function") {
            (ref as (node: HTMLElement) => void)(node);
        }
    };

    return (
        <KobalteTooltip
            placement={placement()}
            onOpenChange={onOpenChange}
            gutter={6}
            openDelay={400}
            // moving along a toolbar shows each name at once rather than
            // waiting out the delay again for every button
            skipDelayDuration={300}
        >
            <KobalteTooltip.Trigger
                aria-keyshortcuts={keyShortcuts()}
                aria-description={description()}
                {...trigger}
                ref={setRef}
            />

            <KobalteTooltip.Portal>
                {/*
                    the dropdowns' surface, not `neutral`: the light theme's
                    neutral pair is pale on grey, where this one is held to
                    4.5:1 by the theme contract in both themes
                */}
                <KobalteTooltip.Content
                    data-placement={placement()}
                    class="z-50 flex items-center gap-2 rounded-sm border border-base-content/15 bg-base-300 px-2 py-1 text-label text-base-content elev-overlay"
                >
                    <KobalteTooltip.Arrow size={10} />

                    <span>{local.content}</span>

                    <Show when={local.shortcutKeys?.length}>
                        <kbd class="kbd kbd-xs">{formatShortcut(local.shortcutKeys!)}</kbd>
                    </Show>
                </KobalteTooltip.Content>
            </KobalteTooltip.Portal>
        </KobalteTooltip>
    );
};

export default Tooltip;
