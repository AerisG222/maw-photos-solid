import { Component } from 'solid-js';
import ToolbarButton from '../components/ToolbarButton';

const ListToolbar: Component = () => {
    const onToggleThumbnail = () => {
        console.log("thumbnail");
    }

    const onToggleMargins = () => {
        console.log("margins");
    }

    return (
        <>
            <ToolbarButton
                icon="i-ic-round-photo-size-select-large"
                name="Toggle List Thumbnail Size"
                clickHandler={onToggleThumbnail}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Category Margins"
                clickHandler={onToggleMargins}
            />
        </>
    );
};

export default ListToolbar;
