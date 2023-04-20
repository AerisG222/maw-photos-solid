import { ParentComponent, Show } from 'solid-js'
import Divider from '../components/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { searchGrid, searchList } from './_routes';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

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
