import { getNameWithShortcut } from "../_components/shortcuts/_util";

/*
   The text a control's tooltip shows, read without opening it.

   The tooltip only exists in the document while it is open, so this rebuilds
   it from what the control says about itself all the time - its description, or
   its name where the tooltip says nothing more, and its shortcut. It reads the
   same as the `title` these controls used to carry, so the tests that pinned
   shortcuts and wording through `title` did not have to change what they
   expect.
*/
export const tooltipOf = (el: Element) => {
    const text = el.getAttribute("aria-description") ?? el.getAttribute("aria-label") ?? "";
    const keys = el.getAttribute("aria-keyshortcuts");

    return getNameWithShortcut(text, keys ? keys.split("+") : undefined);
};
