export const EAGER_THRESHOLD = 50;

/*
   How much of a feed to ask for at a time. The paged endpoints choose their own
   size; this is for the random feed, which is told how many to hand back, and it
   is kept in step with them so every grid grows by the same amount.
*/
export const MEDIA_PAGE_SIZE = 50;

// Staggered reveal for grid items. The delay is capped so a year holding
// hundreds of photos still finishes appearing in well under half a second.
export const STAGGER_STEP_MS = 25;
export const STAGGER_LIMIT = 12;
