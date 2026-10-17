import { ParentComponent, Show, children } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";
import { useAreaSettingsContext } from "../../_contexts/settings/AreaSettingsContext";

import { categoriesGrid, categoriesList } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

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
                                to: "/categories/grid",
                                search: { year: area.categoryYearFilter }
                            }),
                            clickHandler: () => setCategoriesView("grid")
                        },
                        {
                            route: categoriesList,
                            link: linkOptions({
                                to: "/categories/list",
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
