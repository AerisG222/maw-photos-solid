import { Component, For, Show } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoriesByYear } from "./hooks/useCategoriesByYear";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { Category } from "../_models/Category";

import Toolbar from "./components/Toolbar";
import GridToolbar from "./components/ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const GridView: Component = () => {
    const [settings] = useCategoryGridViewSettingsContext();
    const { categoriesToDisplay, setIsFavoriteMutation } = useCategoriesByYear();

    const setIsFavorite = (category: Category, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Category> = {
            item: category,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

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

                <For
                    each={Object.keys(categoriesToDisplay()!)
                        .map(x => parseInt(x, 10))
                        .sort()
                        .reverse()}
                >
                    {(year, idx) => (
                        <YearGrid
                            year={year}
                            categories={categoriesToDisplay()![year] ?? []}
                            enableEagerLoading={idx() <= 3}
                            setIsFavorite={setIsFavorite}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default GridView;
