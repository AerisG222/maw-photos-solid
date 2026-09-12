import { Component, Show } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";

import YearFilter from "./YearFilter";
import MissingGpsFilter from "./MissingGpsFilter";

const CategoryFilterBar: Component = () => {
    const [state] = useAuthContext();

    return (
        <div
            class="flex w-full items-center
                    flex-col gap-1 mt-2
                    md:flex-row md:gap-8 md:justify-center md:mt-0"
        >
            <YearFilter />

            <Show when={state.accountStatus?.isAdmin}>
                <MissingGpsFilter />
            </Show>
        </div>
    );
};

export default CategoryFilterBar;
