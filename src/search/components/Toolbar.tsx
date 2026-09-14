import { ParentComponent, Show, children } from "solid-js";

import { searchGrid, searchList } from "../_routes";

import NavGroup from "../../_components/toolbar/NavGroup";
import RequestMoreButton from "../../_components/toolbar/RequestMoreButton";
import ToolbarDivider from "../../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

interface Props {
    canRequestMore: boolean;
    requestMore: () => void;
}

const Toolbar: ParentComponent<Props> = props => {
    const c = children(() => props.children);

    return (
        <ToolbarLayout
            nav={
                <NavGroup
                    entries={[
                        { route: searchGrid, href: searchGrid.absolutePath },
                        { route: searchList, href: searchList.absolutePath }
                    ]}
                />
            }
        >
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
