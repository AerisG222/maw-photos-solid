import { ParentComponent, Show } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { categoriesPhotosBulkEdit, categoriesPhotosDetail, categoriesPhotosFullscreen, categoriesPhotosGrid, categoriesPhotosMap } from './_routes';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesPhotosGrid} />
            <ToolbarLink route={categoriesPhotosDetail} />
            <ToolbarLink route={categoriesPhotosFullscreen} />
            <ToolbarLink route={categoriesPhotosMap} />
            <ToolbarLink route={categoriesPhotosBulkEdit} />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
