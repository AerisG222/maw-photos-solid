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
                icon="i-ic-round-dashboard"
                name="Detail View"
                url="detail"
            />
            <ToolbarLink
                icon="i-ic-round-fullscreen"
                name="Fullscreen View"
                url="fullscreen"
            />
            <ToolbarLink
                icon="i-ic-round-map"
                name="Map View"
                url="map"
            />
            <ToolbarLink
                icon="i-ic-round-collections"
                name="Bulk Edit View"
                url="bulk-edit"
            />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
