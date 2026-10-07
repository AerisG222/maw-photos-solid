import { createMemo } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { Category } from "../../_models/Category";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { UseQueryResult } from "@tanstack/solid-query";
import { CategoryIdsForYearResult } from "../../_contexts/api/models/CategoryIdsForYearResult";
import { Uuid } from "../../_models/Uuid";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";
import { useMediaContext } from "../../_contexts/api/MediaContext";

export const useCategoriesByYear = () => {
    const [area] = useAreaSettingsContext();
    const {
        yearsQuery,
        categoriesForAllYearsQuery,
        categoriesWithoutGpsForAllYearsQuery,
        setIsFavoriteMutation
    } = useCategoriesContext();
    const { restrictedMediaQuery } = useMediaContext();

    const years = yearsQuery();

    /*
       Which years the grid is asking for. Previously this drove a
       `createResource` whose fetcher called `useQueries`, which meant a fresh
       batch of ~30 query observers was created - outside any owner, so never
       disposed - every time the filter changed. Feeding an accessor to
       `useQueries` instead keeps a single subscription that re-targets itself.
    */
    const yearsToLoad = () => {
        if (area.categoryYearFilter === "all") {
            return years.isSuccess ? years.data : [];
        }

        return [area.categoryYearFilter];
    };

    /*
       Only the missing-gps filter consumes this, and it is admin-only. Handing
       back an empty list switches the queries off entirely - without it, every
       visit to the categories page fired one no-gps request per year, around
       thirty of them, for a result nothing was going to read.
    */
    const gpsYearsToLoad = () => (area.categoryMissingGpsFilter ? yearsToLoad() : []);

    const allCategories = categoriesForAllYearsQuery(yearsToLoad);
    const categoryIdsWithoutGps = categoriesWithoutGpsForAllYearsQuery(gpsYearsToLoad);

    /*
       One library-wide call rather than one per year: restrictions are rare,
       so the whole list is small. Only asked while the admin-only filter is on.
    */
    const restricted = restrictedMediaQuery(() => area.categoryRestrictedFilter);

    const allCategoriesReady = () =>
        allCategories.length > 0 && !allCategories.some(result => result.isPending);

    const categoryIdsWithoutGpsReady = () =>
        categoryIdsWithoutGps.length > 0 && !categoryIdsWithoutGps.some(result => result.isPending);

    const getCategoryIdsWithoutGpsForYear = (
        year: number,
        categoryIdsWithoutGpsResult: UseQueryResult<CategoryIdsForYearResult, Error>[]
    ) => categoryIdsWithoutGpsResult.find(x => x.data?.year === year)?.data?.categoryIds;

    /*
       Each filter narrows what the one before it left, so both together mean
       "missing gps and restricted" - and each holds the screen back until its
       own data is in, rather than showing every category and then shrinking.
    */
    const categoriesToDisplay = createMemo(() => {
        if (!allCategoriesReady()) {
            return undefined;
        }

        if (area.categoryMissingGpsFilter && !categoryIdsWithoutGpsReady()) {
            return undefined;
        }

        if (area.categoryRestrictedFilter && !restricted.isSuccess) {
            return undefined;
        }

        const restrictedCategoryIds = new Set<Uuid>((restricted.data ?? []).map(r => r.categoryId));

        return allCategories.reduce<Record<number, Category[]>>((acc, result) => {
            if (result.data) {
                let categories = result.data.categories;

                if (area.categoryMissingGpsFilter) {
                    const ids = getCategoryIdsWithoutGpsForYear(
                        result.data.year,
                        categoryIdsWithoutGps
                    );

                    categories = categories.filter(cat => !!ids?.includes(cat.id));
                }

                if (area.categoryRestrictedFilter) {
                    categories = categories.filter(cat => restrictedCategoryIds.has(cat.id));
                }

                acc[result.data.year] = categories;
            }

            return acc;
        }, {});
    });

    /*
       The screen is fed by the year list plus one query per year, so any of
       them failing leaves `categoriesToDisplay` undefined - indistinguishable
       from still loading unless the failure is surfaced separately.
    */
    const loadError = () =>
        findQueryError([
            years,
            ...allCategories,
            // only consulted while the missing-gps filter is on
            ...(area.categoryMissingGpsFilter ? categoryIdsWithoutGps : []),
            // and this while the restricted filter is
            ...(area.categoryRestrictedFilter ? [restricted] : [])
        ]);

    const retryLoad = () =>
        refetchQueries([
            years,
            ...allCategories,
            ...categoryIdsWithoutGps,
            ...(area.categoryRestrictedFilter ? [restricted] : [])
        ]);

    return { categoriesToDisplay, loadError, retryLoad, setIsFavoriteMutation };
};
