import { Component } from "solid-js";

import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import SearchPage from "./SearchPage";
import GridToolbar from "./components/ToolbarGrid";
import ListingSurface from "../_components/listing/ListingSurface";
import CategoryCard from "../_components/categories/CategoryCard";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const ViewGrid: Component = () => (
    <SearchPage
        toolbar={<GridToolbar />}
        skeleton={<SkeletonGrid />}
        results={(categories, setIsFavorite) => (
            <ListingSurface class="my-4" items={categories()}>
                {(category, index) => (
                    <CategoryCard
                        category={category}
                        eager={index <= EAGER_THRESHOLD}
                        setIsFavorite={setIsFavorite}
                    />
                )}
            </ListingSurface>
        )}
    />
);

export default ViewGrid;
