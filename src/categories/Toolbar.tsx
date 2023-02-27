import { ParentComponent, Show } from 'solid-js'
import { categoriesGrid, categoriesList } from '../routes';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesGrid} />
            <ToolbarLink route={categoriesList} />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
