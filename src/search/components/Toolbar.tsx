import { ParentComponent, Show, children } from "solid-js";

import { searchGrid, searchList } from "../_routes";

import RequestMoreButton from "../../_components/toolbar/RequestMoreButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../../_components/toolbar/ToolbarLink";

interface Props {
    canRequestMore: boolean;
    requestMore: () => void;
}

const Toolbar: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarLink href={searchGrid.absolutePath} route={searchGrid} />
            <ToolbarLink href={searchList.absolutePath} route={searchList} />

            <ToolbarDivider />

            {/* the same control the media screens page with, rather than a
                button below the results that moves as they grow */}
            <RequestMoreButton disabled={!props.canRequestMore} requestMore={props.requestMore} />

            <Show when={!!c()}>
                <ToolbarDivider />

                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
