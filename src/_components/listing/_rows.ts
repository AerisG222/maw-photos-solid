/*
   How a wrapping grid divides into rows.

   The arithmetic behind the virtualised listing, kept out of it because jsdom
   lays nothing out: a component that measures elements cannot be exercised
   honestly in a unit test, and this is the part that does not need to be. Given
   a width, everything here is decidable.
*/

// `gap-2`
export const GAP = 8;

/*
   A tile's one-pixel border, both sides together. Tile sizes the picture inside
   it, so the border is drawn outside that size, not taken from it.
*/
export const TILE_BORDER = 2;

/*
   The width every tile is drawn at unless a listing says otherwise: the
   thumbnail and its border. Counting the thumbnail alone made each tile 2px
   wider than the arithmetic allowed for, so at some widths a row's last tile
   did not fit, wrapped onto a line of its own, and every row was drawn as a
   full one with a single tile hanging under it.
*/
export const DEFAULT_ITEM_WIDTH = 160 + TILE_BORDER;

// one line of text on a tile - its year, its name - pinned with `leading-6`, see Tile
export const TILE_TEXT_LINE = 24;

/*
   How tall a row of tiles is: the picture, its one-pixel border top and bottom,
   a line for each piece of text, and the gap under the row. Exact rather than
   estimated, so a listing is the right height before a row of it has been
   drawn - and a page coming back to where it was scrolled lands on the same
   tiles, rather than a row out for every row above that was never drawn.
*/
export const tileRowHeight = (pictureHeight: number, textLines = 0) =>
    pictureHeight + TILE_BORDER + textLines * TILE_TEXT_LINE + GAP;

// a photograph is the thumbnail alone
export const mediaRowHeight = (thumbnailHeight: number) => tileRowHeight(thumbnailHeight);

// a category carries its name below, when labels are shown, and its year above
// unless a heading over the listing already says it
export const categoryRowHeight = (thumbnailHeight: number, showLabels: boolean, showYear = true) =>
    tileRowHeight(thumbnailHeight, showLabels ? (showYear ? 2 : 1) : 0);

// a person is a square face crop, as wide as a thumbnail, and their name below
export const personRowHeight = (thumbnailWidth: number, showLabels: boolean) =>
    tileRowHeight(thumbnailWidth, showLabels ? 1 : 0);

/*
   How many fit across.

   Measured rather than assumed, because a panel can open beside a listing and
   take 500px of it away. `n` items need `n * width + (n - 1) * gap`, which
   rearranges to the floor below; at least one, because a container narrower
   than a single tile still has to show it.
*/
export const columnsFor = (width: number, itemWidth = DEFAULT_ITEM_WIDTH) =>
    Math.max(1, Math.floor((width + GAP) / (itemWidth + GAP)));

/*
   The items themselves, not wrapped. A row is drawn with a reference-keyed
   <For>, so whatever a row holds is what decides which tiles survive a change
   to the list. Wrapping each item with its position made a fresh object for
   every item each time the list changed - favoriting one photo patches one
   item, and every tile on screen was torn down and rebuilt, images and all.
*/
// none until it is known how many fit across - see ListingSurface
export const chunkIntoRows = <T>(items: readonly T[], columns: number): T[][] =>
    Array.from({ length: Math.ceil(items.length / columns) }, (_, row) =>
        items.slice(row * columns, row * columns + columns)
    );
