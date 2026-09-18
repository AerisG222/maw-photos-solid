import { Component, For } from "solid-js";

import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import SearchPage from "./SearchPage";
import CategoryListItem from "../_components/categories/CategoryListItem";
import SkeletonList from "../_components/loading/SkeletonList";

const ViewList: Component = () => (
    <SearchPage
        skeleton={<SkeletonList />}
        results={(categories, setIsFavorite) => (
            <div class="my-4">
                <For each={categories()}>
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
        )}
    />
);

export default ViewList;
