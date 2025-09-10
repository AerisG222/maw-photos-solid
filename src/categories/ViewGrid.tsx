import { Component, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoriesByYear } from "./useCategoriesByYear";

import Toolbar from "./Toolbar";
import GridToolbar from "./ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const [settings] = useCategoryGridViewSettingsContext();
    const { categoriesToDisplay } = useCategoriesByYear();

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

                <For each={Object.keys(categoriesToDisplay()!).map(x => parseInt(x, 10)).sort().reverse()}>
                    {(year, idx) => (
                        <YearGrid
                            year={year}
                            categories={categoriesToDisplay()![year] ?? []}
                            enableEagerLoading={idx() <= 3}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default GridView;
