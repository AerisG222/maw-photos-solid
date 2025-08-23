import { ParentComponent, Show, children } from "solid-js";

import { useCategoryContext } from "../_contexts/CategoryContext";
import { useMediaListContext } from "./contexts/MediaListContext";
import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import {
    MediaViewModeBulkEdit,
    MediaViewModeDetail,
    MediaViewModeFullscreen,
    MediaViewModeGrid,
    MediaViewModeMap,
    categoryBulkEditRoute,
    categoryDetailRoute,
    categoryFullscreenRoute,
    categoryGridRoute,
    categoryMapRoute,
    randomDetailRoute,
    randomFullscreenRoute,
    randomGridRoute
} from "./_routes";
import { useRouteDetailContext } from "../_contexts/RouteDetailContext";
import { AreaCategories, AreaRandom } from "../_models/AppRouteDefinition";
import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { useAuthContext } from "../_contexts/AuthContext";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

type Props = {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
};

const Toolbar: ParentComponent<Props> = props => {
    const [, { isAdmin }] = useAuthContext();
    const [routeContext] = useRouteDetailContext();
    const [, { setViewMode }] = useMediaPageSettingsContext();
    const [, { gteMd }] = useMediaBreakpointContext();

    const c = children(() => props.children);

    const getRouteParams = () => ({
        categoryId: props.activeCategory?.id,
        id: props.activeMedia?.id
    });

    const getGridRoute = () => getRouteForArea(categoryGridRoute, randomGridRoute);
    const getDetailRoute = () => getRouteForArea(categoryDetailRoute, randomDetailRoute);
    const getFullscreenRoute = () =>
        getRouteForArea(categoryFullscreenRoute, randomFullscreenRoute);

    const getRouteForArea = (categoryRoute, randomRoute) => {
        switch (routeContext.area) {
            case AreaCategories:
                return categoryRoute;
            case AreaRandom:
                return randomRoute;
            default:
        }
    };

    const isValidArea = () =>
        routeContext.area === AreaCategories || routeContext.area === AreaRandom;

    return (
        <Show when={isValidArea()}>
            <ToolbarLayout>
                <ToolbarLink
                    route={getGridRoute()}
                    routeParams={getRouteParams()}
                    clickHandler={() => setViewMode(MediaViewModeGrid)}
                />

                <Show when={gteMd()}>
                    <ToolbarLink
                        route={getDetailRoute()}
                        routeParams={getRouteParams()}
                        clickHandler={() => setViewMode(MediaViewModeDetail)}
                    />
                    <ToolbarLink
                        route={getFullscreenRoute()}
                        routeParams={getRouteParams()}
                        clickHandler={() => setViewMode(MediaViewModeFullscreen)}
                    />

                    <Show when={routeContext.area === AreaCategories}>
                        <ToolbarLink
                            route={categoryMapRoute}
                            routeParams={getRouteParams()}
                            clickHandler={() => setViewMode(MediaViewModeMap)}
                        />

                        <Show when={isAdmin()}>
                            <ToolbarLink
                                route={categoryBulkEditRoute}
                                routeParams={getRouteParams()}
                                clickHandler={() => setViewMode(MediaViewModeBulkEdit)}
                            />
                        </Show>
                    </Show>
                </Show>

                <Show when={!!c()}>
                    <ToolbarDivider />
                    {c()}
                </Show>
            </ToolbarLayout>
        </Show>
    );
};

export default Toolbar;
