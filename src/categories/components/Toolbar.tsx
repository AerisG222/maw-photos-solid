import { ParentComponent, Show, children } from "solid-js";

import { buildSearch, categoriesGrid, categoriesList } from "../_routes";
import { useCategoryPageSettingsContext } from "../../_contexts/settings/CategoryPageSettingsContext";
import { useCategoryFilterSettingsContext } from "../../_contexts/settings/CategoryFilterSettingsContext";
import { buildPath } from "../../_models/utils/RouteUtils";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: ParentComponent = props => {
    const [, { setViewMode }] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <NavGroup
                entries={[
                    {
                        route: categoriesGrid,
                        href: buildPath(
                            categoriesGrid,
                            undefined,
                            buildSearch(filterState.yearFilter)
                        ),
                        clickHandler: () => setViewMode("grid")
                    },
                    {
                        route: categoriesList,
                        href: buildPath(
                            categoriesList,
                            undefined,
                            buildSearch(filterState.yearFilter)
                        ),
                        clickHandler: () => setViewMode("list")
                    }
                ]}
            />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
