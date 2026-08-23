import { Component } from "solid-js";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

interface Props {
    isActive: boolean;
    setHighlightFaces: () => void;
}

/*
   Tracked per view, like the badge toggles beside it: somebody who wants faces
   marked while picking through a grid does not necessarily want them over a
   photo they have opened to look at. The caller supplies its own view's setting.
*/
const ToggleHighlightFacesButton: Component<Props> = props => {
    return (
        <ToolbarButton
            icon="icon-[mdi--face-recognition]"
            name="Faces"
            tooltip="Toggle Face Highlighting"
            shortcutKeys={["q"]}
            clickHandler={() => props.setHighlightFaces()}
            active={props.isActive}
        />
    );
};

export default ToggleHighlightFacesButton;
