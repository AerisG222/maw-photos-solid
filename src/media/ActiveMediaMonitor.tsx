import { ParentComponent, batch, children, createEffect, onCleanup } from "solid-js";
import { useParams } from "@solidjs/router";

import { useMediaListContext } from "./contexts/MediaListContext";

const ActiveMediaMonitor: ParentComponent = props => {
    const params = useParams();
    const [mediaList, { setActiveItem, setItems }] = useMediaListContext();

    const c = children(() => props.children);

    // note: wanted to simply put this in the top level category, but we need this to be defined
    // in an element/component that is a child of the mediaListContext...
    createEffect(() => {
        if (mediaList.items && mediaList.items.length > 0) {
            setActiveItem(params.id ? (params.id as Uuid) : undefined);
        }
    });

    onCleanup(() => {
        batch(() => {
            setActiveItem(undefined);
            setItems([]);
        });
    });

    return <>{c()}</>;
};

export default ActiveMediaMonitor;
