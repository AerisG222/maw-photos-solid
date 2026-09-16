import { UseMutationResult } from "@tanstack/solid-query";

import { IsFavoriteRequest } from "../IsFavoriteRequest";

/*
   Turning a favourite mutation into the handler every tile expects.

   Eight screens each wrote the same six lines: build an `IsFavoriteRequest`
   around an item and a flag, hand it to the mutation. Identical in all of them
   apart from the type of the thing being marked, which is what a generic is
   for.

   Named for what it produces rather than what it does, because the result is
   what gets passed around: `setIsFavorite={favoriteSetter(mutation)}`.
*/
export const favoriteSetter =
    <T>(mutation: UseMutationResult<Response, Error, IsFavoriteRequest<T>, unknown>) =>
    (item: T, isFavorite: boolean) =>
        mutation.mutate({ item, isFavorite });
