import { Component } from "solid-js";

import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

/*
   Shared by the grid, detail and fullscreen toolbars, and reading the setting
   itself rather than taking it as a prop - the three views toggle one mode, so
   there is nothing for a caller to decide.
*/
const ToggleHighlightFacesButton: Component = () => {
    const [settings, { setHighlightFaces }] = useMediaPageSettingsContext();

    return (
        <ToolbarButton
            icon="icon-[mdi--face-recognition]"
            name="Faces"
            tooltip="Toggle Face Highlighting"
            shortcutKeys={["q"]}
            clickHandler={() => setHighlightFaces(!settings.highlightFaces)}
            active={settings.highlightFaces}
        />
    );
};

export default ToggleHighlightFacesButton;
