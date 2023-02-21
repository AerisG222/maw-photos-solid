import { Component } from 'solid-js'
import ToolbarDivider from '../components/toolbar/ToolbarDivider';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import GridToolbar from './GridToolbar';
import ListToolbar from './ListToolbar';

const Toolbar: Component = () => {
    return (
        <div class="flex md:flex-col">
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
        </div>
    );
};

export default Toolbar;
