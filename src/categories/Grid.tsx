import { Component, For } from "solid-js";

import { useCategoriesByYear } from "./hooks/useCategoriesByYear";

import Toolbar from "./components/Toolbar";
import GridToolbar from "./components/ToolbarGrid";
import YearGrid from "./components/YearGrid";
import CategoryFilterBar from "./components/CategoryFilterBar";
import NoCategoriesMatch from "./components/NoCategoriesMatch";
import Layout from "../_components/layout/Layout";
import PageHeader from "../_components/layout/PageHeader";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";

const GridView: Component = () => {
    const { categoriesToDisplay, noMatches, loadError, retryLoad, setIsFavoriteMutation } =
        useCategoriesByYear();

    const setIsFavorite = favoriteSetter(setIsFavoriteMutation);

    return (
        /*
           Layout wraps every state rather than just the loaded one. It owns the
           page backdrop and the toolbar, so gating it on data meant the skeleton
           and the error message rendered on a bare background with no toolbar,
           and the whole page visibly re-chromed itself once the data landed.

           The toolbars here are driven purely by settings, so they are safe to
           show while the categories are still on their way.
        */
        <Layout
            toolbar={
                <Toolbar>
                    <GridToolbar />
                </Toolbar>
            }
        >
            {/* outside the boundary: the name and the filters do not wait for the data */}
            <PageHeader title="Categories" pinned={false} actions={<CategoryFilterBar />} />

            <AsyncBoundary
                error={loadError()}
                onRetry={retryLoad}
                errorTitle="Could not load categories"
                when={categoriesToDisplay()}
                skeleton={<SkeletonGrid />}
                isEmpty={noMatches()}
                empty={<NoCategoriesMatch />}
            >
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
            </AsyncBoundary>
        </Layout>
    );
};

export default GridView;
