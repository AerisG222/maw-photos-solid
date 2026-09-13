import { createMemo } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { Category } from "../../_models/Category";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { UseQueryResult } from "@tanstack/solid-query";
import { CategoryIdsForYearResult } from "../../_contexts/api/models/CategoryIdsForYearResult";
import { Uuid } from "../../_models/Uuid";
import { findQueryError, refetchQueries } from "../../_components/error/_queryError";

export const useCategoriesByYear = () => {
    const [area] = useAreaSettingsContext();
    const {
        yearsQuery,
        categoriesForAllYearsQuery,
        categoriesWithoutGpsForAllYearsQuery,
        setIsFavoriteMutation
    } = useCategoriesContext();

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

    const allCategoriesReady = () =>
        allCategories.length > 0 && !allCategories.some(result => result.isPending);

    const categoryIdsWithoutGpsReady = () =>
        categoryIdsWithoutGps.length > 0 && !categoryIdsWithoutGps.some(result => result.isPending);

    const filterCategoriesWithoutGps = (
        categoriesForYear: Category[],
        categoryIdsWithoutGps: Uuid[] | undefined
    ) => categoriesForYear.filter(cat => !!categoryIdsWithoutGps?.find(id => cat.id === id));

    const getCategoryIdsWithoutGpsForYear = (
        year: number,
        categoryIdsWithoutGpsResult: UseQueryResult<CategoryIdsForYearResult, Error>[]
    ) => categoryIdsWithoutGpsResult.find(x => x.data?.year === year)?.data?.categoryIds;

    const categoriesToDisplay = createMemo(() => {
        if (!area.categoryMissingGpsFilter) {
            if (allCategoriesReady()) {
                return allCategories.reduce<Record<number, Category[]>>((acc, result) => {
                    if (result.data) {
                        acc[result.data.year] = result.data.categories;
                    }
                    return acc;
                }, {});
            }
        } else {
            if (allCategoriesReady() && categoryIdsWithoutGpsReady()) {
                return allCategories.reduce<Record<number, Category[]>>((acc, result) => {
                    if (result.data) {
                        acc[result.data.year] = filterCategoriesWithoutGps(
                            result.data.categories,
                            getCategoryIdsWithoutGpsForYear(result.data.year, categoryIdsWithoutGps)
                        );
                    }
                    return acc;
                }, {});
            }
        }
        return undefined;
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
            ...(area.categoryMissingGpsFilter ? categoryIdsWithoutGps : [])
        ]);

    const retryLoad = () => refetchQueries([years, ...allCategories, ...categoryIdsWithoutGps]);

    return { categoriesToDisplay, loadError, retryLoad, setIsFavoriteMutation };
};
