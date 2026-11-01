import { ParentComponent, Show, children } from "solid-js";
import { linkOptions } from "@tanstack/solid-router";

import { searchGrid, searchList } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import { searchGridRoute, searchListRoute } from "../_routeTree";

const Toolbar: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        {
                            route: searchGrid,
                            link: linkOptions({ to: searchGridRoute.to, search: true })
                        },
                        {
                            route: searchList,
                            link: linkOptions({ to: searchListRoute.to, search: true })
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
