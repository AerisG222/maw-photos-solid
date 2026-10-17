import { ParentComponent, Show, children } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { categoriesGrid, categoriesList } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import { categoriesGridRoute, categoriesListRoute } from "../_routeTree";

const Toolbar: ParentComponent = props => {
    const [area, { setCategoriesView }] = useAreaSettingsContext();

    const c = children(() => props.children);

    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        {
                            route: categoriesGrid,
                            link: linkOptions({
                                to: categoriesGridRoute.to,
                                search: { year: area.categoryYearFilter }
                            }),
                            clickHandler: () => setCategoriesView("grid")
                        },
                        {
                            route: categoriesList,
                            link: linkOptions({
                                to: categoriesListRoute.to,
                                search: { year: area.categoryYearFilter }
                            }),
                            clickHandler: () => setCategoriesView("list")
                        }
                    ]}
                />
            }
        >
            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
