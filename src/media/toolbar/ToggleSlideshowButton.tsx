import { Component, Show } from "solid-js";

import { useSlideshowContext } from "../contexts/SlideshowContext";
import { useParams } from "@solidjs/router";
import { Area, AreaCategories, AreaRandom } from "../../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../../_contexts/RouteDetailContext";

import ToolbarButton from "../../_components/toolbar/ToolbarButton";

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();
    const [routeContext] = useRouteDetailContext();
    const params = useParams();

    return (
        <Show when={showSlideshowButton(routeContext.area)}>
            <ToolbarButton
                icon={state.isPlaying ? "icon-[ic--round-stop" : "i-ic-round-play-arrow]"}
                name="Start / Stop Slideshow"
                shortcutKeys={["p"]}
                clickHandler={toggle}
            />
        </Show>
    );
};

export default ToggleSlideshowButton;

export const showSlideshowButton = (area: Area) => {
    switch (area) {
        case AreaCategories:
            return true; //categoryType ? categoryTypes[categoryType].slideshowAvailable : false;
        case AreaRandom:
            return true;
        default:
            return false;
    }
};
