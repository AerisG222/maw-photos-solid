import { ParentComponent, Show, children } from 'solid-js'

import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { usePhotoPageSettingsContext } from '../contexts/settings/PhotoPageSettingsContext';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [photoState] = usePhotoListContext();
    const [settings, { setViewMode }] = usePhotoPageSettingsContext();

    const c = children(() => props.children);

    const getParams = () => ({
        categoryId: categoryState.activeCategory?.id,
        photoId: photoState.activePhoto?.id
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
