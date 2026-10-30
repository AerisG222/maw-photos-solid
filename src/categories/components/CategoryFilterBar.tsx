import { Component, Show } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";

import YearFilter from "./YearFilter";
import MissingGpsFilter from "./MissingGpsFilter";
import RestrictedFilter from "./RestrictedFilter";

const CategoryFilterBar: Component = () => {
    const [state] = useAuthContext();

    return (
        <>
            <YearFilter />

            <Show when={state.accountStatus?.isAdmin}>
                <MissingGpsFilter />
                <RestrictedFilter />
            </Show>
        </>
    );
};

export default CategoryFilterBar;
