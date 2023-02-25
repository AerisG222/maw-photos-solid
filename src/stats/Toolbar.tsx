import { Component } from 'solid-js'
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink
                icon="i-ic-outline-photo-camera"
                name="Photo Stats"
                url="photos"
            />
            <ToolbarLink
                icon="i-ic-round-videocam"
                name="Video Stats"
                url="videos"
            />
            <ToolbarLink
                icon="i-ic-round-functions"
                name="Combined Stats"
                url="combined"
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
