/*
   How many photographs a slideshow should have in hand beyond the one showing.

   Random has no end, but its list does: the slideshow stops when it reaches the
   last item. So while one is playing, the next page is asked for this far ahead
   - at the default interval that is most of a minute for the request to land,
   which it will long before the slideshow gets there.
*/
export const SLIDESHOW_LOOKAHEAD = 5;

export const needsTopUp = (activeIndex: number, listLength: number) =>
    activeIndex >= 0 && listLength - 1 - activeIndex < SLIDESHOW_LOOKAHEAD;
