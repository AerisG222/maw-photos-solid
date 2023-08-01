import { ParentComponent, children, createEffect, createResource, createSignal, createUniqueId, onCleanup } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { getRandomPhotos } from "../../_api/Photos";

const MediaRandomLoader: ParentComponent = (props) => {
    const [fetchTrigger, setFetchTrigger] = createSignal(createUniqueId());
    const [mediaContext, { addItems }] = useMediaListContext();
    const c = children(() => props.children);

    const fetchRandomMedia = () => getRandomPhotos(mediaContext.items.length === 0 ? 24 : 1);

    const [randomResource] = createResource(fetchTrigger, fetchRandomMedia);

    createEffect(() => {
        if(!randomResource.loading && !randomResource.error) {
            addItems(randomResource());
        }
    });

    const intervalId = setInterval(
        () => setFetchTrigger(createUniqueId()),
        20000
    );

    onCleanup(() => {
        clearInterval(intervalId);
    });

    return (
        <>
            {c()}
        </>
    );
};

export default MediaRandomLoader;
