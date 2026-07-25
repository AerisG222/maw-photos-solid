import { Component, For, Match, Switch } from "solid-js";

import { useCategoryListViewSettingsContext } from "../_contexts/settings/CategoryListViewSettingsContext";
import { useCategoriesByYear } from "./hooks/useCategoriesByYear";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import ListToolbar from "./components/ToolbarList";
import CategoryFilterBar from "./components/CategoryFilterBar";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";
import SkeletonList from "../_components/loading/SkeletonList";
import ErrorMessage from "../_components/error/ErrorMessage";

const ListView: Component = () => {
    const [settings] = useCategoryListViewSettingsContext();
    const { categoriesToDisplay, loadError, retryLoad, setIsFavoriteMutation } =
        useCategoriesByYear();

    const setIsFavorite = (category: Category, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Category> = {
            item: category,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        // error is checked first: a failed year query also leaves
        // categoriesToDisplay undefined, which would otherwise skeleton forever
        <Switch fallback={<SkeletonList thumbnailSize={settings.thumbnailSize} />}>
            <Match when={loadError()}>
                <ErrorMessage
                    title="Could not load categories"
                    error={loadError()}
                    onRetry={retryLoad}
                />
            </Match>

            <Match when={categoriesToDisplay()}>
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
            </Match>
        </Switch>
    );
};

export default ListView;
