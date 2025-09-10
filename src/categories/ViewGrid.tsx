import { Component, createMemo, createResource, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";
import { Category } from '../_models/Category';

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const { yearsQuery, categoriesForAllYearsQuery } =
        useCategoriesContext();
    const [filter] = useCategoryFilterSettingsContext();
    const [settings] = useCategoryGridViewSettingsContext();
    const years = yearsQuery();

    const [allCategories] = createResource(
        () => ({yearFilter: filter.yearFilter, yearsReady: years.isSuccess}),
        () => {
            if(filter.yearFilter === "all") {
                if(years.isSuccess) {
                    return categoriesForAllYearsQuery(years.data);
                }
            } else {
                return categoriesForAllYearsQuery([filter.yearFilter]);
            }
        }
    );

    const categoriesToDisplay = createMemo(() => {
        if(allCategories() && !allCategories()!.some(result => result.isPending)) {
            return allCategories()!.reduce<Record<number, Category[]>>((acc, result) => {
                    if(result.data) {
                        for(const cat of result.data) {
                            const year = cat.effectiveDate.getFullYear();

                            if(!acc[year]) {
                                acc[year] = [];
                            }

                            acc[year]?.push(cat);
                        }
                    }

                    return acc;
                }, {});
        }

        return undefined;
    });

    return (
        <Show when={categoriesToDisplay()} fallback={<Loading />}>
            <Layout
                toolbar={
                    <Toolbar>
                        <GridToolbar />
                    </Toolbar>
                }
                margin={settings.margin}
            >
                <CategoryFilterBar />

                <For each={Object.keys(categoriesToDisplay()!).sort().reverse()}>
                    {(year, idx) => (
                        <YearGrid
                            year={year}
                            categories={categoriesToDisplay()[year] ?? []}
                            enableEagerLoading={idx() === 0}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default GridView;
