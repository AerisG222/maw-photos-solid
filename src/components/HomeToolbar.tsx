import { Component } from 'solid-js'
import ToolbarLink from './ToolbarLink';

const HomeToolbar: Component = () => {
    return (
        <div class="flex md:flex-col">
            <ToolbarLink
                icon="i-ic-outline-apps"
                name="Grid View"
                url="/xyz"
            />
        </div>
    );
};

export default HomeToolbar;
