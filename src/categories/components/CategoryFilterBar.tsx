import { Component, Show } from "solid-js";

import { useMediaBreakpointContext } from "../../_contexts/MediaBreakpointContext";
import { useAuthContext } from "../../_contexts/AuthContext";

import YearFilter from "./YearFilter";
import MissingGpsFilter from "./MissingGpsFilter";

const CategoryFilterBar: Component = () => {
    const [state] = useAuthContext();
    const [, { ltMd }] = useMediaBreakpointContext();

    return (
        <div
            class="flex w-full flex-items-center
                    flex-col gap-1 mt-2
                    md:flex-row md:gap-8 md:justify-center md:mt-0"
        >
            <YearFilter horizontal={ltMd()} />

            <Show when={state.isAdmin}>
                <MissingGpsFilter horizontal={ltMd()} />
            </Show>
        </div>
    );
};

export default CategoryFilterBar;
