import { ParsedLocation, redirect } from "@tanstack/solid-router";

/*
   The detail and fullscreen views are gone; their addresses are not.

   Detail showed one photograph with a filmstrip under it and the info panel
   beside it - and the grid already showed the same photograph, over the grid,
   through the same component. Fullscreen showed it with the chrome around it
   still there, which is a state rather than a destination; it is a toggle on
   the grid now.

   So these stay for as long as anyone has a link to one. The slug is identical
   in every view, which makes this a substitution rather than a parse -
   `/detail/2019/a-category/a-photo` becomes `/grid/2019/a-category/a-photo`,
   and the reader lands on the photograph they were sent. A `beforeLoad`, so
   nothing renders on the way through; these were components that mounted and
   then navigated.
*/
export const gridAddressFor = (href: string) =>
    href.replace(/\/(detail|fullscreen)(?=\/|\?|#|$)/, "/grid");

export const redirectToGrid = ({ location }: { location: ParsedLocation }) => {
    throw redirect({ href: gridAddressFor(location.href), replace: true });
};
