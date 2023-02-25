import { Component } from 'solid-js'
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import GridToolbar from './ToolbarGrid';
import ListToolbar from './ToolbarList';

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink
                icon="i-ic-outline-apps"
                name="Grid View"
                url="/grid"
            />
            <ToolbarLink
                icon="i-ic-round-format-list-bulleted"
                name="List View"
                url="/list"
            />

            <ToolbarDivider />
            <GridToolbar />
            <ToolbarDivider />
            <ListToolbar />
        </ToolbarLayout>
    );
};

export default Toolbar;
