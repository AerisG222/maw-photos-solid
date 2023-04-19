import { ParentComponent, Show } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from './_routes';
import { useParams } from '@solidjs/router';

const Toolbar: ParentComponent = (props) => {
    const categoryId = parseInt(useParams().id);
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesPhotosGrid}       routeParams={{id: categoryId}} />
            <ToolbarLink route={categoriesPhotosDetail}     routeParams={{id: categoryId}} />
            <ToolbarLink route={categoriesPhotosFullscreen} routeParams={{id: categoryId}} />
            <ToolbarLink route={categoriesPhotosMap}        routeParams={{id: categoryId}} />
            <ToolbarLink route={categoriesPhotosBulkEdit}   routeParams={{id: categoryId}} />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
