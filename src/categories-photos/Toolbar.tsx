import { ParentComponent, Show } from 'solid-js'

import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from './_routes';
import { useCategoryContext } from '../contexts/CategoryContext';
import { usePhotoListContext } from '../contexts/PhotoListContext';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const [categoryState] = useCategoryContext();
    const [photoState] = usePhotoListContext();

    const c = () => props.children;
    const getParams = () => ({
        categoryId: categoryState.activeCategory?.id,
        photoId: photoState.activePhoto?.id
    });

    return (
        <Show when={categoryState.activeCategory}>
            <ToolbarLayout>
                <ToolbarLink route={categoriesPhotosGrid}       routeParams={getParams()} />
                <ToolbarLink route={categoriesPhotosDetail}     routeParams={getParams()} />
                <ToolbarLink route={categoriesPhotosFullscreen} routeParams={getParams()} />
                <ToolbarLink route={categoriesPhotosMap}        routeParams={getParams()} />
                <ToolbarLink route={categoriesPhotosBulkEdit}   routeParams={getParams()} />

                <Show when={!!c()}>
                    <Divider />
                    {c()}
                </Show>
            </ToolbarLayout>
        </Show>
    );
};

export default Toolbar;
