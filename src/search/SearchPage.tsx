import { Accessor, Component, JSXElement } from "solid-js";

import { useSearchContext } from "./contexts/SearchContext";
import { Category } from "../_models/Category";
import { favoriteSetter } from "../_models/utils/FavoriteUtils";

import Toolbar from "./components/Toolbar";
import Layout from "../_components/layout/Layout";
import SearchBar from "./components/SearchBar";
import AsyncBoundary from "../_components/state/AsyncBoundary";

export type SetIsFavorite = (category: Category, isFavorite: boolean) => void;

interface Props {
    // extra controls for this view's toolbar, after the shared ones
    toolbar?: JSXElement;
    skeleton: JSXElement;
    /*
       Called once, with an accessor rather than the array: handing over the
       array would rebuild the whole listing - virtualiser and all - each time
       another page of results arrived, where the listing only needs its items.
    */
    results: (categories: Accessor<Category[]>, setIsFavorite: SetIsFavorite) => JSXElement;
}

/*
   Everything the grid and the list have in common, which is everything but the
   results.

   They were two copies of one page that differed only in how a category is
   drawn - and two copies are how the recent searches came to look different
   between them. The search bar, the toolbar, the loading and error states and
   the query now exist once, and a view only says how to lay out what came back.
*/
const SearchPage: Component<Props> = props => {
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
                    {props.toolbar}
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
                skeleton={props.skeleton}
            >
                {props.results(() => allSearchResults(searchQuery), setIsFavorite)}
            </AsyncBoundary>
        </Layout>
    );
};

export default SearchPage;
