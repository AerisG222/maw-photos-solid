import { Component, Show } from "solid-js";

import { useSlideshowContext } from "../contexts/SlideshowContext";
import { useParams } from "@solidjs/router";
import { categoryTypes } from "../../_models/CategoryTypes";
import { CategoryType } from "../../_models/CategoryType";
import { Area, AreaCategories, AreaRandom } from "../../_models/AppRouteDefinition";
import { useRouteDetailContext } from "../../contexts/RouteDetailContext";

import ToolbarButton from "../../components/toolbar/ToolbarButton";

const ToggleSlideshowButton: Component = () => {
    const [state, { toggle }] = useSlideshowContext();
    const [routeContext] = useRouteDetailContext();
    const params = useParams();

    const onToggleSlideshow = () => {
        toggle();
    };

    return (
        <Show when={showSlideshowButton(routeContext.area, params.categoryType as CategoryType)}>
            <ToolbarButton
                icon={state.isPlaying ? "i-ic-round-stop" : "i-ic-round-play-arrow"}
                name="Start / Stop Slideshow (P)"
                shortcutKeys={["p"]}
                clickHandler={onToggleSlideshow}
            />
        </Show>
    );
};

export default ToggleSlideshowButton;

export const showSlideshowButton = (area: Area, categoryType?: CategoryType) => {
    switch(area) {
        case AreaCategories:
            return categoryType ? categoryTypes[categoryType].slideshowAvailable : false;
        case AreaRandom:
            return true;
        default:
            return false;
    }
};
