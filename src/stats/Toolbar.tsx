import { Component } from 'solid-js'
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { statsCombined, statsPhotos, statsVideos } from './_routes';

const Toolbar: Component = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink route={statsPhotos} />
            <ToolbarLink route={statsVideos} />
            <ToolbarLink route={statsCombined} />
        </ToolbarLayout>
    );
};

export default Toolbar;
