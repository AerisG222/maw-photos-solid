import { ParentComponent, Show } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
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
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
