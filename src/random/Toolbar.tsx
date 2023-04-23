import { ParentComponent, Show } from 'solid-js'
import Divider from '../components/layout/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { randomDetail, randomFullscreen, randomGrid } from './_routes';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

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
