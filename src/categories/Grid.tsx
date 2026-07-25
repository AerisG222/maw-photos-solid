import { Component, For, Match, Switch } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../_contexts/settings/CategoryGridViewSettingsContext";
import { useCategoriesByYear } from "./hooks/useCategoriesByYear";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { Category } from "../_models/Category";

import Toolbar from "./components/Toolbar";
import GridToolbar from "./components/ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import Layout from "../_components/layout/Layout";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import ErrorMessage from "../_components/error/ErrorMessage";

const GridView: Component = () => {
    const [settings] = useCategoryGridViewSettingsContext();
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
        <Switch fallback={<SkeletonGrid thumbnailSize={settings.thumbnailSize} />}>
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
            </Match>
        </Switch>
    );
};

export default GridView;
