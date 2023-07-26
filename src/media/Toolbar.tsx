import { ParentComponent, Show, children } from 'solid-js'

import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from './contexts/MediaListContext';
import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaViewModeBulkEdit, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid, MediaViewModeMap, categoryBulkEditRoute, categoryDetailRoute, categoryFullscreenRoute, categoryGridRoute, categoryMapRoute } from './_routes';
import { isAdmin } from '../auth/auth';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { AreaCategories } from '../_models/AppRouteDefinition';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [mediaList] = useMediaListContext();
    const [routeContext] = useRouteDetailContext();
    const [, { setViewMode }] = usePhotoPageSettingsContext();

    const c = children(() => props.children);

    // todo: pull these from url?
    const getRouteParams = () => ({
        categoryType: categoryState?.activeCategory?.type,
        categoryId: categoryState?.activeCategory?.id,
        id: mediaList.activeItem?.id,
    });

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoryGridRoute}       routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeGrid)} />
            <ToolbarLink route={categoryDetailRoute}     routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeDetail)} />
            <ToolbarLink route={categoryFullscreenRoute} routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeFullscreen)} />

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
    );
};

export default Toolbar;
