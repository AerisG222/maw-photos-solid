import { Component } from "solid-js";

import { EAGER_THRESHOLD } from "../_models/utils/Constants";

import SearchPage from "./SearchPage";
import GridToolbar from "./components/ToolbarGrid";
import ListingSurface from "../_components/listing/ListingSurface";
import CategoryCard from "../_components/categories/CategoryCard";
import { useCategoryRowHeight } from "../_components/categories/useCategoryRowHeight";
import SkeletonGrid from "../_components/loading/SkeletonGrid";

const ViewGrid: Component = () => {
    const rowHeight = useCategoryRowHeight();

    return (
        <SearchPage
            toolbar={<GridToolbar />}
            skeleton={<SkeletonGrid />}
            results={(categories, setIsFavorite) => (
                <ListingSurface class="mb-4" estimatedRowHeight={rowHeight()} items={categories()}>
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
};

export default ViewGrid;
