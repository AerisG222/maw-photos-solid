import { ParentComponent, Show, children } from 'solid-js'

import { randomDetail, randomFullscreen, randomGrid } from './_routes';

import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink route={randomGrid} />
            <ToolbarLink route={randomDetail} />
            <ToolbarLink route={randomFullscreen} />

            <Show when={!!c()}>
                <Divider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
