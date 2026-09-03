import { JSXElement, ParentComponent, children } from "solid-js";
import { useNavigate } from "@solidjs/router";

import { Uuid } from "../../_models/Uuid";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";
import ToolbarLayout from "../../_components/toolbar/ToolbarLayout";

interface Props {
    // the place one level up, or undefined at the root and while the chain is
    // still being read
    parentId: Uuid | undefined;
    atRoot: boolean;
    // where the two navigation buttons lead. The browse and the administration
    // walk the same tree down different paths, so the walking is shared and the
    // destination is not
    buildPath: (id?: Uuid) => string;
    // anything belonging to one of the two screens rather than to both - the way
    // into the photographs, or the way across to the other screen
    children?: JSXElement;
}

const PlaceTreeToolbar: ParentComponent<Props> = props => {
    const navigate = useNavigate();
    const c = children(() => props.children);

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon="icon-[ic--round-public]"
                name="All Places"
                tooltip="Back to the Countries"
                shortcutKeys={["a"]}
                disabled={props.atRoot}
                clickHandler={() => navigate(props.buildPath())}
            />
            <ToolbarButton
                icon="icon-[ic--round-arrow-upward]"
                name="Up"
                tooltip="Up One Level"
                shortcutKeys={["u"]}
                disabled={props.atRoot}
                clickHandler={() => navigate(props.buildPath(props.parentId))}
            />

            {c()}
        </ToolbarLayout>
    );
};

export default PlaceTreeToolbar;
