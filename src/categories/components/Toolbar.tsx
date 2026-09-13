import { ParentComponent, Show, children } from "solid-js";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { buildSearch, categoriesGrid, categoriesList } from "../_routes";
import { buildPath } from "../../_models/utils/RouteUtils";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

const Toolbar: ParentComponent = props => {
    const [area, { setCategoriesView }] = useAreaSettingsContext();

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
                            buildSearch(area.categoryYearFilter)
                        ),
                        clickHandler: () => setCategoriesView("grid")
                    },
                    {
                        route: categoriesList,
                        href: buildPath(
                            categoriesList,
                            undefined,
                            buildSearch(area.categoryYearFilter)
                        ),
                        clickHandler: () => setCategoriesView("list")
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
