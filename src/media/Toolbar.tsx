import { ParentComponent, Show, children } from 'solid-js'

import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from '../contexts/MediaListContext';
import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';
import { MediaViewModeBulkEdit, MediaViewModeDetail, MediaViewModeFullscreen, MediaViewModeGrid, MediaViewModeMap, bulkEditRoute, detailRoute, fullscreenRoute, gridRoute, mapRoute } from './_routes';
import { isAdmin } from '../auth/auth';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [mediaList] = useMediaListContext();
    const [, { setViewMode }] = usePhotoPageSettingsContext();

    const c = children(() => props.children);

    // todo: pull these from url?
    const getRouteParams = () => ({
        categoryType: categoryState.activeCategory.type,
        categoryId: categoryState.activeCategory?.id,
        id: mediaList.activeItem?.id,
    });

    return (
        <Show when={categoryState.activeCategory}>
            <ToolbarLayout>
                <ToolbarLink route={gridRoute}       routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeGrid)} />
                <ToolbarLink route={detailRoute}     routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeDetail)} />
                <ToolbarLink route={fullscreenRoute} routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeFullscreen)} />
                <ToolbarLink route={mapRoute}        routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeMap)} />

                <Show when={isAdmin()}>
                    <ToolbarLink route={bulkEditRoute}   routeParams={getRouteParams()} clickHandler={() => setViewMode(MediaViewModeBulkEdit)} />
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
