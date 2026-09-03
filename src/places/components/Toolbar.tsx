import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Uuid } from "../../_models/Uuid";
import { getPlaceAdminPath } from "../_routes";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

interface Props {
    // the place one level up, or undefined at the root and while the chain is
    // still being read
    parentId: Uuid | undefined;
    atRoot: boolean;
}

const Toolbar: Component<Props> = props => {
    const navigate = useNavigate();

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon="icon-[ic--round-public]"
                name="All Places"
                tooltip="Back to the Countries"
                shortcutKeys={["a"]}
                disabled={props.atRoot}
                clickHandler={() => navigate(getPlaceAdminPath())}
            />
            <ToolbarButton
                icon="icon-[ic--round-arrow-upward]"
                name="Up"
                tooltip="Up One Level"
                shortcutKeys={["u"]}
                disabled={props.atRoot}
                clickHandler={() => navigate(getPlaceAdminPath(props.parentId))}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
