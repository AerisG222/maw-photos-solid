import { ParentComponent, Show, children } from 'solid-js'

import { buildSearch, categoriesGrid, categoriesList } from './_routes';
import { useCategoryPageSettingsContext } from '../contexts/settings/CategoryPageSettingsContext';
import { useCategoryFilterSettingsContext } from '../contexts/settings/CategoryFilterSettingsContext';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const [settings, { setViewMode }] = useCategoryPageSettingsContext();
    const [filterState] = useCategoryFilterSettingsContext();
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink route={categoriesGrid} routeSearch={buildSearch(filterState.yearFilter, filterState.typeFilter)} clickHandler={() => setViewMode('grid')} />
            <ToolbarLink route={categoriesList} routeSearch={buildSearch(filterState.yearFilter, filterState.typeFilter)} clickHandler={() => setViewMode('list')} />

            <Show when={!!c()}>
                <Divider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
