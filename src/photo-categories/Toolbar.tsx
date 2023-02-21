import { Component } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import GridToolbar from './GridToolbar';

const Toolbar: Component = () => {
    return (
        <div class="flex md:flex-col">
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

            <ToolbarDivider />
            <GridToolbar />
        </div>
    );
};

export default Toolbar;
