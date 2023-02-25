import { ParentComponent } from 'solid-js'
import ToolbarLayout from '../components/toolbar/ToolbarLayout';
import ToolbarLink from '../components/toolbar/ToolbarLink';

const Toolbar: ParentComponent = () => {
    return (
        <ToolbarLayout>
            <ToolbarLink
                icon="i-ic-round-home"
                name="Application"
                url="application"
            />
            <ToolbarLink
                icon="i-ic-round-collections"
                name="Categories"
                url="categories"
            />
            <ToolbarLink
                icon="i-ic-round-image"
                name="Photos"
                url="photos"
            />
            <ToolbarLink
                icon="i-ic-round-videocam"
                name="Videos"
                url="videos"
            />
            <ToolbarLink
                icon="i-ic-round-search"
                name="Search"
                url="search"
            />
            <ToolbarLink
                icon="i-ic-round-shuffle"
                name="Random"
                url="random"
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
