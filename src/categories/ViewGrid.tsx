import { Component, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoryContext } from "../_contexts/CategoryContext";
import { useConfigContext } from "../_contexts/api/ConfigContext";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const { scalesQuery } = useConfigContext();
    const [, { getFilteredCategoriesForYear, getFilteredYears }] = useCategoryContext();
    const [settings] = useCategoryGridViewSettingsContext();

    return (
        <Show when={scalesQuery().isSuccess} fallback={<Loading />}>
            <Layout
                toolbar={
                    <Toolbar>
                        <GridToolbar />
                    </Toolbar>
                }
                margin={settings.margin}
            >
                <CategoryFilterBar />

                <For each={getFilteredYears()}>
                    {(year, idx) => (
                        <YearGrid
                            year={year}
                            categories={getFilteredCategoriesForYear(year)}
                            enableEagerLoading={idx() === 0}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default GridView;
