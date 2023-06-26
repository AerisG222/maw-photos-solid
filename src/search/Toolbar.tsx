import { ParentComponent, Show, children } from 'solid-js'

import { searchGrid, searchList } from './_routes';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink route={searchGrid} />
            <ToolbarLink route={searchList} />

            <Show when={!!c()}>
                <Divider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
