import { createMemo, createResource } from "solid-js";

import { Category } from "../../_models/Category";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { useCategoryFilterSettingsContext } from '../../_contexts/settings/CategoryFilterSettingsContext';

export const useCategoriesByYear = () => {
    const [filter] = useCategoryFilterSettingsContext();
    const { categoriesForAllYearsQuery, setIsFavoriteMutation } = useCategoriesContext();
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

    const categoriesToDisplay = createMemo(() => {
        if (allCategories() && !allCategories()!.some(result => result.isPending)) {
            return allCategories()!.reduce<Record<number, Category[]>>((acc, result) => {
                if (result.data) {
                    acc[result.data.year] = result.data.categories;
                }
                return acc;
            }, {});
        }
        return undefined;
    });

    return { categoriesToDisplay, setIsFavoriteMutation };
}
