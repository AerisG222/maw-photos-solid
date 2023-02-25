import { ParentComponent, Show } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink
                icon="i-ic-outline-apps"
                name="Grid View"
                url="grid"
            />
            <ToolbarLink
                icon="i-ic-round-format-list-bulleted"
                name="List View"
                url="list"
            />

            <Show when={!!c()}>
                <ToolbarDivider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
