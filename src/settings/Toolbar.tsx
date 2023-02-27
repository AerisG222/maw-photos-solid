import { ParentComponent } from 'solid-js'
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';
import { settingsApplication, settingsCategories, settingsPhotos, settingsRandom, settingsSearch, settingsVideos } from '../routes';

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink route={settingsApplication} />
            <ToolbarLink route={settingsCategories} />
            <ToolbarLink route={settingsPhotos} />
            <ToolbarLink route={settingsVideos} />
            <ToolbarLink route={settingsSearch} />
            <ToolbarLink route={settingsRandom} />
        </ToolbarLayout>
    );
};

export default Toolbar;
