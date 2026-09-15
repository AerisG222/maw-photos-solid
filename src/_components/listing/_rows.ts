/*
   How a wrapping grid divides into rows.

   The arithmetic behind the virtualised listing, kept out of it because jsdom
   lays nothing out: a component that measures elements cannot be exercised
   honestly in a unit test, and this is the part that does not need to be. Given
   a width, everything here is decidable.
*/

// `gap-2`
export const GAP = 8;

// the width every tile is drawn at unless a listing says otherwise
export const DEFAULT_ITEM_WIDTH = 160;

/*
   How many fit across.

   Measured rather than assumed, because a panel can open beside a listing and
   take 500px of it away. `n` items need `n * width + (n - 1) * gap`, which
   rearranges to the floor below; at least one, because a container narrower
   than a single tile still has to show it.
*/
export const columnsFor = (width: number, itemWidth = DEFAULT_ITEM_WIDTH) =>
    Math.max(1, Math.floor((width + GAP) / (itemWidth + GAP)));

export interface RowEntry<T> {
    readonly item: T;
    // the position in the whole listing, not in the row - callers decide what to
    // load eagerly by it
    readonly index: number;
}

export const chunkIntoRows = <T>(items: readonly T[], columns: number): RowEntry<T>[][] =>
    Array.from({ length: Math.ceil(items.length / columns) }, (_, row) =>
        items.slice(row * columns, row * columns + columns).map((item, offset) => ({
            item,
            index: row * columns + offset
        }))
    );
