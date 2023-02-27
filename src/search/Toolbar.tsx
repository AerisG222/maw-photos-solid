import { ParentComponent, Show } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { searchGrid, searchList } from '../routes';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={searchGrid} />
            <ToolbarLink route={searchList} />

            <Show when={!!c()}>
                <ToolbarDivider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
