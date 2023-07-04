import { Match, ParentComponent, Show, Switch, children } from 'solid-js'

import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from '../../categories-photos/_routes';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { useMediaListContext } from '../../contexts/MediaListContext';
import { usePhotoPageSettingsContext } from '../../contexts/settings/PhotoPageSettingsContext';

import Divider from '../layout/Divider';
import ToolbarLayout from '../toolbar/ToolbarLayout';
import ToolbarLink from '../toolbar/ToolbarLink';
import { MediaTypePhoto, MediaTypeVideo } from '../../models/Media';
import { categoriesVideosDetail } from '../../categories-videos/_routes';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [mediaList] = useMediaListContext();
    const [settings, { setViewMode }] = usePhotoPageSettingsContext();

    const c = children(() => props.children);

    const getPhotoParams = () => ({
        categoryId: categoryState.activeCategory?.id,
        photoId: mediaList.activeItem?.id,
    });

    const getVideoParams = () => ({
        categoryId: categoryState.activeCategory?.id,
        videoId: mediaList.activeItem?.id,
    });

    return (
        <Show when={categoryState.activeCategory}>
            <ToolbarLayout>
                <Switch>
                    <Match when={categoryState.activeCategory.type === MediaTypePhoto}>
                        <ToolbarLink route={categoriesPhotosGrid}       routeParams={getPhotoParams()} clickHandler={() => setViewMode("grid")}/>
                        <ToolbarLink route={categoriesPhotosDetail}     routeParams={getPhotoParams()} clickHandler={() => setViewMode("detail")}/>
                        <ToolbarLink route={categoriesPhotosFullscreen} routeParams={getPhotoParams()} clickHandler={() => setViewMode("fullscreen")}/>
                        <ToolbarLink route={categoriesPhotosMap}        routeParams={getPhotoParams()} clickHandler={() => setViewMode("map")}/>
                        <ToolbarLink route={categoriesPhotosBulkEdit}   routeParams={getPhotoParams()} clickHandler={() => setViewMode("bulkEdit")}/>
                    </Match>
                    <Match when={categoryState.activeCategory.type === MediaTypeVideo}>
                        <ToolbarLink route={categoriesVideosDetail}     routeParams={getVideoParams()} clickHandler={() => setViewMode("detail")}/>
                    </Match>
                </Switch>

                <Show when={!!c()}>
                    <Divider />
                    {c()}
                </Show>
            </ToolbarLayout>
        </Show>
    );
};

export default Toolbar;
