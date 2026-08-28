import { Component } from "solid-js";

import ToolbarButton from "./ToolbarButton";

interface Props {
    // shown even with nothing left to fetch, so the group it heads does not
    // change width as a listing reaches its end
    disabled: boolean;
    requestMore: () => void;
}

/*
   Fetches the next page of whatever is being listed - media, search results,
   the categories somebody appears in. One button, one key, wherever paging
   happens, rather than a differently shaped control per screen.
*/
const RequestMoreButton: Component<Props> = props => {
    return (
        <ToolbarButton
            disabled={props.disabled}
            icon="icon-[ic--round-fast-forward]"
            name="Request More"
            tooltip="Request More"
            shortcutKeys={["r"]}
            clickHandler={() => props.requestMore()}
        />
    );
};

export default RequestMoreButton;
