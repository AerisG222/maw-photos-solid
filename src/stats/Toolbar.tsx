import { ParentComponent, Show, children } from "solid-js";

import { statsCombined, statsPhotos, statsVideos } from "./_routes";

import ToolbarLayout from "../components/toolbar/ToolbarLayout";
import ToolbarLink from "../components/toolbar/ToolbarLink";
import ToolbarDivider from "../components/toolbar/ToolbarDivider";

const Toolbar: ParentComponent = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink route={statsPhotos} />
            <ToolbarLink route={statsVideos} />
            <ToolbarLink route={statsCombined} />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
