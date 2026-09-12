export const getNameWithShortcut = (name: string, shortcutKeys?: string[]) => {
    if (!shortcutKeys || shortcutKeys.length === 0) {
        return name;
    }

    const shortcut = shortcutKeys
        .join("-")
        .toUpperCase()
        .replace("ARROWRIGHT", "→")
        .replace("ARROWLEFT", "←");

    return `${name} (${shortcut})`;
};

/*
   Whether the reader is typing into something.

   The application binds single letters as shortcuts, so every keystroke in a
   text field would otherwise also press a toolbar button. Each input used to
   defend itself with `evt.stopPropagation()` in its own keydown handler, which
   meant a new input was broken by default until somebody noticed.
*/
export const isEditableTarget = (target: EventTarget | Element | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
};
