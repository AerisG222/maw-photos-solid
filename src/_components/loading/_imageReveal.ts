/*
   Which image urls have recently been shown.

   Favoriting an item invalidates its query with `refetchType: "all"`, so the
   list is rebuilt from fresh objects and Solid's reference-keyed <For> disposes
   and re-creates every tile - with a src the browser already has cached. Tying
   the fade purely to component lifetime therefore reset every thumbnail to
   transparent on each heart click.

   Tracking reveals by url instead means a tile that has already been on screen
   comes back visible immediately, and only genuinely new images fade in.

   Bounded on purpose. The set only has to cover images that could still be on
   screen when a refetch rebuilds the grid, so anything older is safe to forget:
   the worst case for an evicted url is that its thumbnail fades in again, which
   is what it would have done anyway. Without a cap this grows for the life of
   the page, and because the entries are the very `path` strings held by the
   query cache, it would also keep them alive long after their media objects
   were evicted.
*/
const MAX_TRACKED = 1000;

const revealed = new Set<string>();

// an item without a teaser has no url to track - such an <img> reports
// `complete` immediately, so the onMount check still reveals it
export const hasRevealed = (url: string | undefined) => !!url && revealed.has(url);

export const markRevealed = (url: string | undefined) => {
    if (!url || revealed.has(url)) {
        return;
    }

    revealed.add(url);

    // a Set iterates in insertion order, so the first key is the oldest. One
    // eviction per insert is enough to pin the size at the cap.
    if (revealed.size > MAX_TRACKED) {
        const oldest = revealed.values().next().value;

        if (oldest !== undefined) {
            revealed.delete(oldest);
        }
    }
};
