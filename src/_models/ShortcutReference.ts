/*
   What the keyboard does, as a thing that can be read.

   Deliberately separate from `ShortcutContext`, which holds what is registered
   *right now* - that is what the `?` dialog lists, and it is the right answer to
   "what can I press here". It is the wrong answer to "how does this application
   work", because the screen you would be reading it on is the one screen whose
   shortcuts you are not asking about, and because the part worth explaining is
   the rule rather than the list: the digits are positional, so there is one
   thing to learn instead of a letter per screen.

   Written from what is actually bound, not from what the plan proposed. §7 of
   the redesign specifies a different letter map - `d` for density, `l` for
   labels, `[` and `]` for rotation - and that reassignment was never carried
   out, so documenting it here would have described an application that does not
   exist. See the note in the plan.
*/
export interface ShortcutReferenceEntry {
    readonly keys: string[];
    readonly action: string;
    readonly scope: string;
}

export interface ShortcutReferenceGroup {
    readonly title: string;
    readonly detail: string;
    readonly entries: ShortcutReferenceEntry[];
}

export const shortcutReference: ShortcutReferenceGroup[] = [
    {
        title: "Getting around",
        detail:
            "The digits follow the order of the links in the toolbar, wherever you are: the " +
            "first view offered is always 1. One rule, rather than a letter per screen.",
        entries: [
            { keys: ["1"], action: "The first view offered here", scope: "Every screen" },
            { keys: ["2"], action: "The second, and so on up to 9", scope: "Every screen" },
            { keys: ["←", "→"], action: "Previous / next photograph", scope: "Any media view" },
            { keys: ["?"], action: "What the keys do on this screen", scope: "Everywhere" }
        ]
    },
    {
        title: "The photograph",
        detail: "Anywhere one is on screen, including the grid.",
        entries: [
            { keys: ["i"], action: "Open / close the Inspector", scope: "Any media view" },
            { keys: ["p"], action: "Start / stop the slideshow", scope: "Any media view" },
            { keys: ["a"], action: "Rotate counter-clockwise", scope: "Any media view" },
            { keys: ["d"], action: "Rotate clockwise", scope: "Any media view" },
            { keys: ["q"], action: "Highlight faces", scope: "Any media listing" }
        ]
    },
    {
        title: "How a listing looks",
        detail: "One setting behind each, shared by every listing in the application.",
        entries: [
            { keys: ["s"], action: "Cycle density", scope: "Any listing" },
            { keys: ["t"], action: "Show / hide labels", scope: "Any listing" },
            { keys: ["h"], action: "Show / hide badges", scope: "Any listing" },
            { keys: ["b"], action: "Dim thumbnails until hovered", scope: "Any listing" },
            { keys: ["o"], action: "Cycle the sort order", scope: "People" },
            { keys: ["r"], action: "Load more", scope: "Any paged listing" }
        ]
    },
    {
        title: "Narrowing things down",
        detail: "",
        entries: [
            { keys: ["u"], action: "Favourites only", scope: "Feeds" },
            { keys: ["j"], action: "Shuffle", scope: "Media feeds" }
        ]
    },
    {
        title: "Administering places",
        detail: "Only where you have permission to change them.",
        entries: [
            { keys: ["e"], action: "Edit mode", scope: "Places" },
            { keys: ["c"], action: "Choose the cover photograph", scope: "Places" },
            { keys: ["m"], action: "Move this place", scope: "Places" },
            { keys: ["g"], action: "Merge another place into it", scope: "Places" }
        ]
    }
];
