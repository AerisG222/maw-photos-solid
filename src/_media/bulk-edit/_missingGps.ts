/*
   The next photo on screen without a location, either way from where the
   reader is.

   Working through a category's gps means finding the gaps, and with the grid
   showing everything - the photos either side of a gap are the best clue to
   where it was taken - scrolling to find the next one was most of the work.

   `from` is the photo last stepped to or clicked. With none, or one no longer
   on screen, the search starts at the near end and counts it: Next from the
   first photo, Previous from the last. Undefined when there is no gap that way.
*/
export const findMissingGps = <Id>(
    shown: readonly Id[],
    hasGps: (id: Id) => boolean,
    from: Id | undefined,
    step: -1 | 1
): Id | undefined => {
    const at = from === undefined ? -1 : shown.indexOf(from);
    const start = at !== -1 ? at + step : step === 1 ? 0 : shown.length - 1;

    for (let i = start; i >= 0 && i < shown.length; i += step) {
        const id = shown[i]!;

        if (!hasGps(id)) {
            return id;
        }
    }

    return undefined;
};
