import { Component, createSignal, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryContext } from "../_contexts/CategoryContext";
import { useConfigContext } from "../_contexts/api/ConfigContext";
import { useCategoriesContext } from "../_contexts/api/CategoriesContext";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const [year, setYear] = createSignal(2024);

    const { scalesQuery } = useConfigContext();
    const { categoriesForYearQuery } = useCategoriesContext();
    //const [, { getFilteredCategoriesForYear, getFilteredYears }] = useCategoryContext();
    const [settings] = useCategoryGridViewSettingsContext();

    const categories = categoriesForYearQuery(year);
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

                <For each={[year()]}>
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
