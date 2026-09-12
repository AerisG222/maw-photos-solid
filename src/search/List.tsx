import { Component, For, Match, Switch } from "solid-js";

import { useSearchListViewSettingsContext } from "../_contexts/settings/SearchListViewSettingsContext";
import { useSearchContext } from "./contexts/SearchContext";
import { EAGER_THRESHOLD } from "../_models/utils/Constants";
import { Category } from "../_models/Category";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import Toolbar from "./components/Toolbar";
import ListToolbar from "./components/ToolbarList";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import CategoryListItem from "../_components/categories/CategoryListItem";
import SkeletonList from "../_components/loading/SkeletonList";
import ErrorMessage from "../_components/error/ErrorMessage";

const ViewList: Component = () => {
    const [settings] = useSearchListViewSettingsContext();
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
            toolbar={
                <Toolbar
                    canRequestMore={searchQuery.hasNextPage}
                    requestMore={() => void searchQuery.fetchNextPage()}
                >
                    <ListToolbar />
                </Toolbar>
            }
            margin={settings.margin}
        >
            <div class="mt-4">
                <SearchBar />
            </div>

            {/*
                the toolbar and search bar stay put so the term can be retried or
                edited. Error first, for the same reason as the categories grid.
                The results branch also covers "no term yet": that query never
                runs, so it sits pending-but-idle forever and would otherwise
                skeleton an empty page.
            */}
            <Switch fallback={<SkeletonList thumbnailSize={settings.thumbnailSize} />}>
                <Match when={searchQuery.isError}>
                    <ErrorMessage
                        title="Search could not be completed"
                        error={searchQuery.error}
                        onRetry={() => void searchQuery.refetch()}
                    />
                </Match>

                <Match when={!state.activeTerm || searchQuery.isSuccess}>
                    <div class="my-4">
                        <For each={allSearchResults(searchQuery) ?? []}>
                            {(category, idx) => (
                                <CategoryListItem
                                    category={category}
                                    showYear={true}
                                    thumbnailSize={settings.thumbnailSize}
                                    dimThumbnails={settings.dimThumbnails}
                                    eager={idx() <= EAGER_THRESHOLD}
                                    setIsFavorite={setIsFavorite}
                                />
                            )}
                        </For>
                    </div>
                </Match>
            </Switch>
        </Layout>
    );
};

export default ViewList;
