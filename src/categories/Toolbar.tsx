import { ParentComponent, Show, children } from "solid-js";

import { buildSearch, categoriesGrid, categoriesList } from "./_routes";
import { useCategoryPageSettingsContext } from "../_contexts/settings/CategoryPageSettingsContext";
import { useCategoryFilterSettingsContext } from "../_contexts/settings/CategoryFilterSettingsContext";
import { buildPath } from "../_models/utils/RouteUtils";

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
                href={buildPath(categoriesGrid, undefined, buildSearch(filterState.yearFilter))}
                route={categoriesGrid}
                clickHandler={() => setViewMode("grid")}
            />
            <ToolbarLink
                href={buildPath(categoriesList, undefined, buildSearch(filterState.yearFilter))}
                route={categoriesList}
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
