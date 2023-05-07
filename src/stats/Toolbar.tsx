import { ParentComponent, Show } from 'solid-js'

import { statsCombined, statsPhotos, statsVideos } from './_routes';

import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import Divider from '../components/layout/Divider';

const Toolbar: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <ToolbarLayout>
            <ToolbarLink route={statsPhotos} />
            <ToolbarLink route={statsVideos} />
            <ToolbarLink route={statsCombined} />

            <Show when={!!c()}>
                <Divider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
