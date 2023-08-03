import { Component, Show } from "solid-js";

import { isAdmin } from "../../auth/auth";
import { useMediaBreakpointContext } from '../../contexts/MediaBreakpointContext';

import CategoryTypeFilter from "./CategoryTypeFilter";
import YearFilter from "./YearFilter";
import MissingGpsFilter from "./MissingGpsFilter";

const CategoryFilterBar: Component = () => {
    const [,{ ltMd }] = useMediaBreakpointContext();

    return (
        <div class="flex w-full flex-items-center
                    flex-col flex-gap-1 mt-2
                    md:flex-row md:flex-gap-8 md:justify-center md:mt-0">
            <YearFilter horizontal={ltMd()} />
            <CategoryTypeFilter horizontal={ltMd()} />

            <Show when={isAdmin()}>
                <MissingGpsFilter horizontal={ltMd()} />
            </Show>
        </div>
    );
};

export default CategoryFilterBar;
