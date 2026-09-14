import { Component, For } from "solid-js";

import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryListItem from "../_components/categories/CategoryListItem";
import SkeletonList from "../_components/loading/SkeletonList";
import AsyncBoundary from "../_components/state/AsyncBoundary";

const ViewList: Component = () => {
    const [state, { categorySearchQuery, allSearchResults, setIsFavoriteMutation }] =
        useSearchContext();
    /*
       One subscription, re-keyed by the term. Rebuilding the query inside an
       effect created a new observer per search and disposed of none of them,
       and every leaked observer kept its query active for later invalidations.
    */
    const searchQuery = categorySearchQuery(() => state.activeTerm);

    const setIsFavorite = (category: Category, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Category> = {
            item: category,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        <Layout
            margin
            toolbar={
                <Toolbar
                    canRequestMore={searchQuery.hasNextPage}
                    requestMore={() => void searchQuery.fetchNextPage()}
                />
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
                skeleton={<SkeletonList />}
            >
                <div class="my-4">
                    <For each={allSearchResults(searchQuery) ?? []}>
                        {(category, idx) => (
                            <CategoryListItem
                                category={category}
                                showYear={true}
                                eager={idx() <= EAGER_THRESHOLD}
                                setIsFavorite={setIsFavorite}
                            />
                        )}
                    </For>
                </div>
            </AsyncBoundary>
        </Layout>
    );
};

export default ViewList;
