import { Component, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryContext } from "../_contexts/CategoryContext";
import { useConfigContext } from "../_contexts/api/ConfigContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const { scalesQuery } = useConfigContext();
    const { categoriesForYearQuery } = useCategoriesContext();
    const [filter] = useCategoryFilterSettingsContext();
    //const [, { getFilteredCategoriesForYear, getFilteredYears }] = useCategoryContext();
    const [settings] = useCategoryGridViewSettingsContext();

    const categories = categoriesForYearQuery(() => filter.yearFilter as number);
    const doShow = () => scalesQuery().isSuccess && categories.isSuccess;

    return (
        <Show when={doShow()} fallback={<Loading />}>
            <Layout
                toolbar={
                    <Toolbar>
                        <GridToolbar />
                    </Toolbar>
                }
                margin={settings.margin}
            >
                <CategoryFilterBar />

                <For each={[filter.yearFilter]}>
                    {(year, idx) => (
                        <YearGrid
                            year={year}
                            categories={categories.data!}
                            enableEagerLoading={idx() === 0}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default GridView;
