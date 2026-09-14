import { Component, For, Show, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useAuthContext } from "../../_contexts/AuthContext";
import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";
import { useMediaSettingsContext } from "../../_contexts/settings/MediaSettingsContext";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { InspectorCardIdType } from "../../_models/InspectorCard";
import { MediaView } from "../../_models/MediaView";
import { applicableCards } from "./registry";

import EmptyState from "../state/EmptyState";
import InspectorCard from "./InspectorCard";
import InspectorRail from "./InspectorRail";
import InspectorRailButton from "./InspectorRailButton";
import ToolbarDivider from "../toolbar/ToolbarDivider";

interface Props {
    // which view is asking, so a card that would say nothing here can bow out
    view: MediaView;
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    enableCategoryTeaser?: boolean;
    mediaElement?: HTMLImageElement | HTMLVideoElement | undefined;
    requestMoveNext?: () => void;
}

/*
   Everything about the photograph you are looking at, wherever you are looking
   at it.

   This was the detail view's sidebar, and only the detail view's: comments,
   EXIF, the histogram, the minimap and the editing tools existed on exactly one
   screen, so browsing a grid and wanting to know when something was taken meant
   leaving the grid. That was the complaint this whole rework started from.

   Nothing here knows which view it is in beyond asking each card whether it
   applies - the minimap steps aside on the map, the histogram where there is no
   image element to read - so mounting it somewhere new costs one line.

   The open cards are one ordered list in the media store rather than eight
   booleans, which is what lets the arrangement travel with the reader instead of
   belonging to the screen.

   Three shapes, one panel. Wide enough for both and it sits beside the
   photograph; narrower and it comes over the right-hand side; on a phone it
   rises from the bottom. It was a fixed 500px column before, on a viewport that
   can be 390px wide - which is to say it was unusable on a phone, so it was
   simply never mounted there.
*/
const Inspector: Component<Props> = props => {
    const [authContext] = useAuthContext();
    const [settings, { setInspectorOpen, toggleInspectorCard }] = useMediaSettingsContext();
    const [, { gteMd, gteLg }] = useMediaBreakpointContext();

    // beside the photograph only where there is room for both of them
    const docked = () => gteLg();

    /*
       Escape closes it, but only where it is covering something. Docked it is
       part of the page and Escape belongs to whatever else wants it.
    */
    onMount(() => {
        const onKeyDown = (evt: KeyboardEvent) => {
            if (evt.key === "Escape" && settings.inspectorOpen && !docked()) {
                evt.preventDefault();
                setInspectorOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        onCleanup(() => window.removeEventListener("keydown", onKeyDown));
    });

    const cards = () =>
        applicableCards({
            view: props.view,
            media: props.activeMedia,
            category: props.activeCategory,
            isAdmin: !!authContext.accountStatus?.isAdmin,
            enableCategoryTeaser: !!props.enableCategoryTeaser,
            hasMediaElement: !!props.mediaElement
        });

    const isOpen = (id: InspectorCardIdType) => settings.inspectorCards.includes(id);

    /*
       No key of their own. Eight single letters used to open eight cards, and
       four of them meant something else elsewhere in the application - `c` was
       also a place's cover, `e` an edit mode, `o` the people sort. `i` opens the
       panel and the chooser is focusable, so a card is two keystrokes rather
       than one and no letter has to mean two things.
    */
    const cardButtons = () => (
        <For each={cards()}>
            {card => (
                <InspectorRailButton
                    disabled={!settings.inspectorOpen}
                    name={card.title}
                    tooltip={card.title}
                    icon={card.icon}
                    clickHandler={() =>
                        settings.inspectorOpen ? toggleInspectorCard(card.id) : undefined
                    }
                    active={settings.inspectorOpen && isOpen(card.id)}
                />
            )}
        </For>
    );

    return (
        <div class="flex">
            {/*
                Dismisses on a tap outside, which is the gesture anything
                covering the page has to answer. Docked there is nothing to
                dismiss.
            */}
            <Show when={settings.inspectorOpen && !docked()}>
                <div
                    class="fixed inset-0 z-30 bg-base-300/60"
                    onClick={() => setInspectorOpen(false)}
                    aria-hidden="true"
                />
            </Show>

            <Show when={settings.inspectorOpen}>
                <div
                    role={docked() ? "complementary" : "dialog"}
                    aria-label="Inspector"
                    aria-modal={docked() ? undefined : "false"}
                    class="bg-base-200 border-base-content/30 overflow-y-auto overflow-x-hidden"
                    classList={{
                        "w-[500px] border-l-1": docked(),
                        // over the right-hand side on a tablet, up from the
                        // bottom on a phone
                        "fixed z-40 inset-y-0 right-0 w-[min(500px,80vw)] border-l-1 elev-overlay":
                            !docked() && gteMd(),
                        "fixed z-40 inset-x-0 bottom-0 h-[70dvh] rounded-t-box border-t-1 elev-overlay":
                            !docked() && !gteMd()
                    }}
                >
                    {/*
                        On a phone the chooser sits at the top of the sheet
                        rather than in the strip behind it: eight buttons plus
                        the toggle is more than a 390px edge holds, and the
                        sheet is where you are already looking.
                    */}
                    <Show when={!gteMd()}>
                        <div class="flex overflow-x-auto border-b-1 border-b-base-content/20">
                            {cardButtons()}
                        </div>
                    </Show>

                    {/*
                        Every card is about one photograph, and reaches into it
                        without checking - the detail view could only ever render
                        them with one open, so none of them had to. A grid or a
                        map can be looked at with nothing selected at all, which
                        is a state the panel has to answer rather than crash on.
                    */}
                    <Show
                        when={props.activeMedia}
                        fallback={
                            <EmptyState
                                icon="icon-[ic--round-photo-library]"
                                title="Nothing selected"
                                detail="Choose a photograph to see its details here."
                            />
                        }
                    >
                        <For each={cards()}>
                            {card => (
                                <Show when={isOpen(card.id)}>
                                    <InspectorCard title={card.title} icon={card.icon}>
                                        <Dynamic
                                            component={card.component}
                                            activeCategory={props.activeCategory}
                                            activeMedia={props.activeMedia}
                                            mediaElement={props.mediaElement}
                                            requestMoveNext={
                                                props.requestMoveNext ?? (() => undefined)
                                            }
                                        />
                                    </InspectorCard>
                                </Show>
                            )}
                        </For>
                    </Show>
                </div>
            </Show>

            <InspectorRail>
                <InspectorRailButton
                    name="Inspector"
                    tooltip="Show / Hide the Inspector"
                    icon={
                        settings.inspectorOpen
                            ? "icon-[ic--round-chevron-right]"
                            : "icon-[ic--round-chevron-left]"
                    }
                    shortcutKeys={["i"]}
                    clickHandler={() => setInspectorOpen(!settings.inspectorOpen)}
                />

                <Show when={gteMd()}>
                    <ToolbarDivider />

                    {cardButtons()}
                </Show>
            </InspectorRail>
        </div>
    );
};

export default Inspector;
