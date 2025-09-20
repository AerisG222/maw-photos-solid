import { createMemo, createResource } from "solid-js";

import { Category } from "../../_models/Category";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useCategoryFilterSettingsContext } from "../../_contexts/settings/CategoryFilterSettingsContext";
import { UseQueryResult } from "@tanstack/solid-query";
import { CategoryIdsForYearResult } from "../../_contexts/api/models/CategoryIdsForYearResult";
import { Uuid } from "../../_models/Uuid";

export const useCategoriesByYear = () => {
    const [filter] = useCategoryFilterSettingsContext();
    const {
        categoriesForAllYearsQuery,
        categoriesWithoutGpsForAllYearsQuery,
        setIsFavoriteMutation
    } = useCategoriesContext();
    const { yearsQuery } = useCategoriesContext();
    const years = yearsQuery();

    const [allCategories] = createResource(
        () => ({ yearFilter: filter.yearFilter, yearsReady: years.isSuccess }),
        () => {
            if (filter.yearFilter === "all") {
                if (years.isSuccess) {
                    return categoriesForAllYearsQuery(years.data);
                }
            } else {
                return categoriesForAllYearsQuery([filter.yearFilter]);
            }
        }
    );

    const allCategoriesReady = () =>
        allCategories() && !allCategories()!.some(result => result.isPending);

    const [categoryIdsWithoutGps] = createResource(
        () => ({
            yearFilter: filter.yearFilter,
            gpsFilter: filter.missingGpsFilter,
            yearsReady: years.isSuccess
        }),
        () => {
            if (filter.yearFilter === "all") {
                if (years.isSuccess) {
                    return categoriesWithoutGpsForAllYearsQuery(years.data);
                }
            } else {
                return categoriesWithoutGpsForAllYearsQuery([filter.yearFilter]);
            }
        }
    );

    const categoryIdsWithoutGpsReady = () =>
        categoryIdsWithoutGps() && !categoryIdsWithoutGps()!.some(result => result.isPending);

    const filterCategoriesWithoutGps = (
        categoriesForYear: Category[],
        categoryIdsWithoutGps: Uuid[] | undefined
    ) => categoriesForYear.filter(cat => !!categoryIdsWithoutGps?.find(id => cat.id === id));

    const getCategoryIdsWithoutGpsForYear = (
        year: number,
        categoryIdsWithoutGpsResult: UseQueryResult<CategoryIdsForYearResult, Error>[]
    ) => categoryIdsWithoutGpsResult.find(x => x.data?.year === year)?.data?.categoryIds;

    const categoriesToDisplay = createMemo(() => {
        if (!filter.missingGpsFilter) {
            if (allCategoriesReady()) {
                return allCategories()!.reduce<Record<number, Category[]>>((acc, result) => {
                    if (result.data) {
                        acc[result.data.year] = result.data.categories;
                    }
                    return acc;
                }, {});
            }
        } else {
            if (allCategoriesReady() && categoryIdsWithoutGpsReady()) {
                return allCategories()!.reduce<Record<number, Category[]>>((acc, result) => {
                    if (result.data) {
                        acc[result.data.year] = filterCategoriesWithoutGps(
                            result.data.categories,
                            getCategoryIdsWithoutGpsForYear(
                                result.data.year,
                                categoryIdsWithoutGps.latest!
                            )
                        );
                    }
                    return acc;
                }, {});
            }
        }
        return undefined;
    });

    return { categoriesToDisplay, setIsFavoriteMutation };
};
