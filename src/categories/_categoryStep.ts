/*
   Where "previous category" and "next category" go while browsing.

   From the category at the top of the screen - the one whose header is
   pinned. Next is the one after it. Previous goes back to the start of this
   one when the reader is part-way down it, and only to the one before once
   they are already at its start, as a previous-track button does: pressing it
   in the middle of a long category and landing two away would skip the one
   they were looking at.

   Undefined where there is nowhere to go.
*/

// how far into a category still counts as its start - a scroll lands within a pixel or two
export const AT_START = 8;

export interface ScreenTop {
    // the category at the top of the screen, and where it starts
    index: number;
    start: number;
    // how far the page is scrolled
    offset: number;
    count: number;
}

export const nextCategory = (top: ScreenTop | undefined) =>
    top && top.index + 1 < top.count ? top.index + 1 : undefined;

export const previousCategory = (top: ScreenTop | undefined) => {
    if (!top) {
        return undefined;
    }

    if (top.offset - top.start > AT_START) {
        return top.index;
    }

    return top.index > 0 ? top.index - 1 : undefined;
};
