import { Component } from 'solid-js';
import ToolbarLink from '../components/ToolbarLink';

const ListToolbar: Component = () => {
    return (
        <>
            <ToolbarLink
                icon="i-ic-round-photo-size-select-large"
                name="Toggle List Thumbnail Size"
                url="/xxx"
            />
            <ToolbarLink
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins"
                url="/xxx"
            />
        </>
    );
};

export default ListToolbar;
