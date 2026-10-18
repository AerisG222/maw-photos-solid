import { Accessor } from "solid-js";

import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { MediaParams } from "./services/_navigation";
import { Uuid } from "../_models/Uuid";

/*
   The category the address names, by its year and slug.

   The API knows a category by id, the address by year and slug, so the year's
   list - almost always cached already - is what joins the two. Every media
   view asks this way. The feeds and the random stack used to wait instead for
   their list of media to arrive, find the open photo in it, and copy its
   category's id across in an effect, so the breadcrumb could only start loading
   once the photos had. The address names the photo's category from the start.

   Nothing while the address names no category - a feed or the random stack
   with no photo open.

   `known` is a category id already in hand - the open photo's, once its list
   has loaded - which needs no lookup at all. The year's list is asked for only
   while there is none, so stepping through the random stack, which spans every
   year, does not fetch a year's list for each year it crosses.
*/
export const useAddressedCategory = (
    params: Accessor<MediaParams>,
    known: Accessor<Uuid | undefined> = () => undefined
) => {
    const { categoriesForYearQuery, categoryQuery } = useCategoriesContext();

    // NaN, which leaves the year's list switched off, while there is an id already
    const year = () => (known() ? Number.NaN : parseInt(params().categoryYear ?? "", 10));
    const categoriesForYear = categoriesForYearQuery(year);

    /*
       Everything is read up front, so all of it is tracked. Reading only what
       was needed - the known id, then the year's list - meant a run with no
       list never read the address; and once the photo's own id had switched
       the list off, nothing it tracked could change again, so the breadcrumb
       never appeared after a photo was picked from the random grid.
    */
    const categoryId = () => {
        const id = known();
        const slug = params().categorySlug;
        const wantedYear = year();
        const categories = categoriesForYear.data?.categories;

        return (
            id ??
            categories?.find(category => category.year === wantedYear && category.slug === slug)?.id
        );
    };

    const category = categoryQuery(categoryId);

    return { categoriesForYear, categoryId, category };
};
