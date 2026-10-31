import { Category } from "../_models/Category";
import { MediaType } from "../_models/MediaType";
import { Uuid } from "../_models/Uuid";
import { CategoryFilters } from "./_search";

export const countCategoryFilters = (filters: CategoryFilters) =>
    [filters.f, filters.t, filters.noGps, filters.restricted].filter(Boolean).length;

/*
   Each filter narrows what the one before it left, so together they mean all of
   them at once. Favorites is the category's own flag rather than whether it holds
   a favorite photo, and the type is whether it holds any of that type.
*/
export const filterCategories = (
    categories: Category[],
    filters: CategoryFilters,
    withoutGps: Uuid[] | undefined,
    restricted: Set<Uuid>
) =>
    categories.filter(
        category =>
            (!filters.f || category.isFavorite) &&
            (!filters.t || category.mediaTypes.includes(filters.t as MediaType)) &&
            (!filters.noGps || !!withoutGps?.includes(category.id)) &&
            (!filters.restricted || restricted.has(category.id))
    );
