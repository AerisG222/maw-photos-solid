import { Component } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import DetailToolbar from './DetailToolbar';
import GridToolbar from './GridToolbar';

const Toolbar: Component = () => {
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

            <ToolbarDivider />
            <GridToolbar />
            <ToolbarDivider />
            <DetailToolbar />
        </ToolbarLayout>
    );
};

export default Toolbar;
