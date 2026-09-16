import { Component } from "solid-js";
import ListingSurface from "../_components/listing/ListingSurface";

import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import Toolbar from "./components/Toolbar";
import GridToolbar from "./components/ToolbarGrid";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryCard from "../_components/categories/CategoryCard";
import SkeletonGrid from "../_components/loading/SkeletonGrid";
import AsyncBoundary from "../_components/state/AsyncBoundary";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";

const ViewGrid: Component = () => {
    const [state, { categorySearchQuery, allSearchResults, setIsFavoriteMutation }] =
        useSearchContext();
    /*
       One subscription, re-keyed by the term. Rebuilding the query inside an
       effect created a new observer per search and disposed of none of them,
       and every leaked observer kept its query active for later invalidations.
    */
    const searchQuery = categorySearchQuery(() => state.activeTerm);

    const setIsFavorite = favoriteSetter(setIsFavoriteMutation);

    return (
        <Layout
            margin
            toolbar={
                <Toolbar
                    canRequestMore={searchQuery.hasNextPage}
                    requestMore={() => void searchQuery.fetchNextPage()}
                >
                    <GridToolbar />
                </Toolbar>
            }
        >
            <div class="mt-4">
                <SearchBar />
            </div>

            {/*
                the toolbar and search bar stay put so the term can be retried or
                edited. The ready check also covers "no term yet": that query
                never runs, so it sits pending-but-idle forever and would
                otherwise skeleton an empty page.
            */}
            <AsyncBoundary
                queries={[searchQuery]}
                errorTitle="Search could not be completed"
                when={!state.activeTerm || searchQuery.isSuccess}
                skeleton={<SkeletonGrid />}
            >
                <ListingSurface class="my-4" items={allSearchResults(searchQuery) ?? []}>
                    {(category, index) => (
                        <CategoryCard
                            category={category}
                            eager={index <= EAGER_THRESHOLD}
                            setIsFavorite={setIsFavorite}
                        />
                    )}
                </ListingSurface>
            </AsyncBoundary>
        </Layout>
    );
};

export default ViewGrid;
