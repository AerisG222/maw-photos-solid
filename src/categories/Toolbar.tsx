import { ParentComponent, Show, children } from "solid-js";

import { buildSearch, categoriesGrid, categoriesList } from "./_routes";
import { useCategoryPageSettingsContext } from "../_contexts/settings/CategoryPageSettingsContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = props => {
    const [, { setViewMode }] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink
                route={categoriesGrid}
                routeSearch={buildSearch(filterState.yearFilter, filterState.typeFilter)}
                clickHandler={() => setViewMode("grid")}
            />
            <ToolbarLink
                route={categoriesList}
                routeSearch={buildSearch(filterState.yearFilter, filterState.typeFilter)}
                clickHandler={() => setViewMode("list")}
            />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
