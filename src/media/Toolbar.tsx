import { ParentComponent, Show, children } from "solid-js"

import { useCategoryContext } from "../contexts/CategoryContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { useMediaPageSettingsContext } from "../contexts/settings/MediaPageSettingsContext";
import { MediaViewModeBulkEdit, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid, MediaViewModeMap, categoryBulkEditRoute, categoryDetailRoute, categoryFullscreenRoute, categoryGridRoute, categoryMapRoute, randomDetailRoute, randomFullscreenRoute, randomGridRoute } from "./_routes";
import { isAdmin } from "../auth/auth";
import { useRouteDetailContext } from "../contexts/RouteDetailContext";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";

import Divider from "../components/layout/Divider";
import ToolbarLayout from "../components/toolbar/ToolbarLayout";
import ToolbarLink from "../components/toolbar/ToolbarLink";

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [mediaList] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();
    const [, { setViewMode }] = useMediaPageSettingsContext();

    const c = children(() => props.children);

    const getRouteParams = () => ({
        categoryType: categoryState?.activeCategory?.type,
        categoryId: categoryState?.activeCategory?.id,
        id: mediaList.activeItem?.id,
    });

    const getGridRoute = () => getRouteForArea(categoryGridRoute, randomGridRoute);
    const getDetailRoute = () => getRouteForArea(categoryDetailRoute, randomDetailRoute);
    const getFullscreenRoute = () => getRouteForArea(categoryFullscreenRoute, randomFullscreenRoute);

    const getRouteForArea = (categoryRoute, randomRoute) => {
        switch(routeContext.area) {
            case AreaCategories:
                return categoryRoute;
            case AreaRandom:
                return randomRoute;
            default:
        }
    };

    const isValidArea = () =>
        routeContext.area === AreaCategories ||
        routeContext.area === AreaRandom;

    return (
        <Show when={isValidArea()}>
            <ToolbarLayout>
                <ToolbarLink route={getGridRoute()}       routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeGrid)} />
                <ToolbarLink route={getDetailRoute()}     routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeDetail)} />
                <ToolbarLink route={getFullscreenRoute()} routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeFullscreen)} />

                <Show when={routeContext.area === AreaCategories}>
                    <ToolbarLink route={categoryMapRoute}        routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeMap)} />

                    <Show when={isAdmin()}>
                        <ToolbarLink route={categoryBulkEditRoute}   routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeBulkEdit)} />
                    </Show>
                </Show>

                <Show when={!!c()}>
                    <Divider />
                    {c()}
                </Show>
            </ToolbarLayout>
        </Show>
    );
};

export default Toolbar;
