/*
   How many photographs should be in hand beyond the one showing.

   A list that arrives a page at a time looks like it ends where the loaded part
   does, so next and the slideshow would stop there. The next page is asked for
   this far ahead - at the default slideshow interval that is most of a minute for
   the request to land, which it will long before anybody gets there.
*/
export const MEDIA_LOOKAHEAD = 5;

export const needsMoreMedia = (activeIndex: number, listLength: number) =>
    activeIndex >= 0 && listLength - 1 - activeIndex < MEDIA_LOOKAHEAD;
