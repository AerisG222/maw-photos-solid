import { ParentComponent, Show } from 'solid-js'

import { categoriesGrid, categoriesList } from './_routes';
import { useCategoryPageSettingsContext } from '../contexts/CategoryPageSettingsContext';

import Divider from '../components/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const [settings, { setViewMode }] = useCategoryPageSettingsContext();
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesGrid} clickHandler={() => setViewMode('grid')} />
            <ToolbarLink route={categoriesList} clickHandler={() => setViewMode('list')} />

            <Show when={!!c()}>
                <Divider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
