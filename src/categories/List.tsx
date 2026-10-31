import { Component, For } from "solid-js";

import { useCategoriesByYear } from "./hooks/useCategoriesByYear";

import Toolbar from "./components/Toolbar";
import CategoryFilterBar from "./components/CategoryFilterBar";
import NoCategoriesMatch from "./components/NoCategoriesMatch";
import YearList from "./components/YearList";
import Layout from "../_components/layout/Layout";
import PageHeader from "../_components/layout/PageHeader";
import SkeletonList from "../_components/loading/SkeletonList";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";

const ListView: Component = () => {
    const { categoriesToDisplay, noMatches, loadError, retryLoad, setIsFavoriteMutation } =
        useCategoriesByYear();

    const setIsFavorite = favoriteSetter(setIsFavoriteMutation);

    return (
        // Layout wraps every state so the backdrop and toolbar are constant -
        // see the note in Grid.tsx
        <Layout toolbar={<Toolbar />}>
            {/* outside the boundary: the name and the filters do not wait for the data */}
            <PageHeader title="Categories" pinned={false} actions={<CategoryFilterBar />} />

            {/*
                error is checked first: a failed year query also leaves
                categoriesToDisplay undefined, which would otherwise skeleton forever
            */}
            <AsyncBoundary
                error={loadError()}
                onRetry={retryLoad}
                errorTitle="Could not load categories"
                when={categoriesToDisplay()}
                skeleton={<SkeletonList />}
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
                        <YearList
                            year={year}
                            categories={categoriesToDisplay()![year] ?? []}
                            enableEagerLoading={idx() === 0}
                            setIsFavorite={setIsFavorite}
                        />
                    )}
                </For>
            </AsyncBoundary>
        </Layout>
    );
};

export default ListView;
