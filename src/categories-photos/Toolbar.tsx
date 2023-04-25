import { ParentComponent, Show } from 'solid-js'
import { useParams } from '@solidjs/router';

import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from './_routes';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const categoryId = parseInt(useParams().categoryId);
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesPhotosGrid}       routeParams={{categoryId: categoryId}} />
            <ToolbarLink route={categoriesPhotosDetail}     routeParams={{categoryId: categoryId}} />
            <ToolbarLink route={categoriesPhotosFullscreen} routeParams={{categoryId: categoryId}} />
            <ToolbarLink route={categoriesPhotosMap}        routeParams={{categoryId: categoryId}} />
            <ToolbarLink route={categoriesPhotosBulkEdit}   routeParams={{categoryId: categoryId}} />

            <Show when={!!c()}>
                <Divider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
