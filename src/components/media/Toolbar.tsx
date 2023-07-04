import { ParentComponent, Show, children } from 'solid-js'

import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from '../../categories-photos/_routes';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { useMediaListContext } from '../../contexts/MediaListContext';

import Divider from '../layout/Divider';
import ToolbarLayout from '../toolbar/ToolbarLayout';
import ToolbarLink from '../toolbar/ToolbarLink';
import { usePhotoPageSettingsContext } from '../../contexts/settings/PhotoPageSettingsContext';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [photoState] = useMediaListContext();
    const [settings, { setViewMode }] = usePhotoPageSettingsContext();

    const c = children(() => props.children);

    const getParams = () => ({
        categoryId: categoryState.activeCategory?.id,
        photoId: photoState.activeItem?.id
    });

    return (
        <Show when={categoryState.activeCategory}>
            <ToolbarLayout>
                <ToolbarLink route={categoriesPhotosGrid}       routeParams={getParams()} clickHandler={() => setViewMode("grid")}/>
                <ToolbarLink route={categoriesPhotosDetail}     routeParams={getParams()} clickHandler={() => setViewMode("detail")}/>
                <ToolbarLink route={categoriesPhotosFullscreen} routeParams={getParams()} clickHandler={() => setViewMode("fullscreen")}/>
                <ToolbarLink route={categoriesPhotosMap}        routeParams={getParams()} clickHandler={() => setViewMode("map")}/>
                <ToolbarLink route={categoriesPhotosBulkEdit}   routeParams={getParams()} clickHandler={() => setViewMode("bulkEdit")}/>

                <Show when={!!c()}>
                    <Divider />
                    {c()}
                </Show>
            </ToolbarLayout>
        </Show>
    );
};

export default Toolbar;