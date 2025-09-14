import { Component, For, Show } from "solid-js";

import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";
import { useCategoriesByYear } from "./hooks/useCategoriesByYear";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import ListToolbar from "./components/ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";
import Loading from "../_components/loading/Loading";

const ListView: Component = () => {
    const [settings] = useCategoryListViewSettingsContext();
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
                        <ListToolbar />
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
                        <YearList
                            year={year}
                            categories={categoriesToDisplay()![year] ?? []}
                            enableEagerLoading={idx() === 0}
                            setIsFavorite={setIsFavorite}
                        />
                    )}
                </For>
            </Layout>
        </Show>
    );
};

export default ListView;
