import { Component, Show } from "solid-js";

import { useAuthContext } from "../../_contexts/AuthContext";
import { useCategoryFilters } from "../hooks/useCategoryFilters";

import FilterMenu from "../../_components/filters/FilterMenu";
import MediaFilterOptions from "../../_components/filters/MediaFilterOptions";
import Checkbox from "../../_components/input/Checkbox";

const CategoriesFilterMenu: Component = () => {
    const [state] = useAuthContext();
    const { filters, activeCount, update, clear } = useCategoryFilters();

    return (
        <FilterMenu
            activeCount={activeCount()}
            onClear={clear}
            toggleFavorites={() => update({ f: filters().f ? undefined : true })}
        >
            <MediaFilterOptions filters={filters()} onChange={update} />

            <Show when={state.accountStatus?.isAdmin}>
                <h3 class="head3 mt-3">Admin</h3>

                <Checkbox
                    title="Missing GPS"
                    name="missing_gps"
                    isSelected={!!filters().noGps}
                    onChange={noGps => update({ noGps: noGps || undefined })}
                />

                {/* the categories holding a restricted photo - including any hidden from you */}
                <Checkbox
                    title="Restricted"
                    name="restricted"
                    isSelected={!!filters().restricted}
                    onChange={restricted => update({ restricted: restricted || undefined })}
                />
            </Show>
        </FilterMenu>
    );
};

export default CategoriesFilterMenu;
