import { Component, Show } from "solid-js";

import { useMediaBreakpointContext } from '../../contexts/MediaBreakpointContext';

import CategoryTypeFilter from "./CategoryTypeFilter";
import YearFilter from "./YearFilter";
import MissingGpsFilter from "./MissingGpsFilter";
import { useAuthContext } from '../../contexts/AuthContext';

const CategoryFilterBar: Component = () => {
    const [, { isAdmin }] = useAuthContext();
    const [,{ ltMd }] = useMediaBreakpointContext();

    return (
        <div class="flex w-full flex-items-center
                    flex-col gap-1 mt-2
                    md:flex-row md:gap-8 md:justify-center md:mt-0">
            <YearFilter horizontal={ltMd()} />
            <CategoryTypeFilter horizontal={ltMd()} />

            <Show when={isAdmin()}>
                <MissingGpsFilter horizontal={ltMd()} />
            </Show>
        </div>
    );
};

export default CategoryFilterBar;
