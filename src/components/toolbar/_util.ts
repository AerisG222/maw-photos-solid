export const getNameWithShortcut = (name: string, shortcutKeys?: string[]) => {
    if(!shortcutKeys || shortcutKeys.length === 0) {
        return name;
    }

    const shortcut = shortcutKeys
        .join("-")
        .toUpperCase()
        .replace("ARROWRIGHT", "→")
        .replace("ARROWLEFT", "←");

    return `${name} (${shortcut})`;
}
