import { ParentComponent, Show, onCleanup } from "solid-js";
import { useRouter } from "@tanstack/solid-router";
import { Popover } from "@kobalte/core/popover";

import { useScrollContainer } from "../layout/ScrollContainerContext";

import Icon from "../icon/Icon";
import ShortcutWrapper from "../shortcuts/ShortcutWrapper";

interface Props {
    // how many are on, which the button says while the menu is closed
    activeCount: number;
    onClear: () => void;
    // for a list with a favorites filter - the key has to work with the menu closed
    toggleFavorites?: () => void;
}

/*
   Everything a page can be narrowed by, behind one button in its header.

   A popover rather than the menu the download options use, which closes on every
   click: filters get flipped a few at a time, looking at what each one does. And
   in the header rather than the toolbar, because a filter is not an action that
   finishes - it goes on hiding things after the menu has closed, so the button
   says how many are on and takes the highlight color for as long as any are.
*/
const FilterMenu: ParentComponent<Props> = props => {
    /*
       A new set of results starts from its top. Left where it was, a shorter list
       landed wherever it now happened to end. Anything in the address changing with
       the path staying put is a change to what is listed; opening a photo is not.
    */
    const router = useRouter({ warn: false });
    const scroller = useScrollContainer();

    if (router) {
        onCleanup(
            router.subscribe("onResolved", event => {
                const from = event.fromLocation;
                const to = event.toLocation;

                if (from?.pathname === to.pathname && from.searchStr !== to.searchStr) {
                    scroller?.()?.scrollTo({ top: 0 });
                }
            })
        );
    }

    return (
        <Popover placement="bottom-end" gutter={4}>
            <Show when={props.toggleFavorites}>
                {/* the content is not mounted until opened, so the key is bound out here */}
                <ShortcutWrapper
                    name="Favorites only"
                    shortcutKeys={["u"]}
                    clickHandler={() => props.toggleFavorites?.()}
                />
            </Show>

            <Popover.Trigger
                class="btn btn-sm btn-outline shrink-0"
                classList={{
                    "btn-primary": props.activeCount > 0,
                    "btn-secondary": props.activeCount === 0
                }}
            >
                <Icon classes="icon-[ic--round-filter-alt] text-lg" />
                Filters
                <Show when={props.activeCount > 0}>
                    <span aria-label={`${props.activeCount} on`}>· {props.activeCount}</span>
                </Show>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content class="z-50 w-64 max-w-[calc(100vw-1rem)] bg-base-100 rounded-box p-3 elev-overlay border border-base-content/20">
                    {props.children}

                    <button
                        type="button"
                        class="btn btn-xs btn-ghost w-full mt-2"
                        disabled={props.activeCount === 0}
                        onClick={() => props.onClear()}
                    >
                        Clear all
                    </button>
                </Popover.Content>
            </Popover.Portal>
        </Popover>
    );
};

export default FilterMenu;
