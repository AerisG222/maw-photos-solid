import { Component } from 'solid-js';
import ToolbarLink from '../components/ToolbarLink';

const GridToolbar: Component = () => {
    return (
        <>
            <ToolbarLink
                icon="i-ic-round-title"
                name="Show / Hide Category Titles"
                url="/xxx"
            />
            <ToolbarLink
                icon="i-ic-round-photo-size-select-large"
                name="Toggle Grid Thumbnail Size"
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

export default GridToolbar;
