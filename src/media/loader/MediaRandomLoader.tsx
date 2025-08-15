import {
    ParentComponent,
    children,
    createEffect,
    createResource,
    createSignal,
    createUniqueId,
    onCleanup
} from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { getRandomMedia } from "../../_api/Media";
import { useMediaPageSettingsContext } from "../../_contexts/settings/MediaPageSettingsContext";

const MediaRandomLoader: ParentComponent = props => {
    const [fetchTrigger, setFetchTrigger] = createSignal({ id: createUniqueId(), count: 24 });
    const [mediaSettings] = useMediaPageSettingsContext();
    const [, { addItems, activeItemIsLast }] = useMediaListContext();
    const c = children(() => props.children);
    let intervalId = -1;

    const fetchRandomMedia = trigger => getRandomMedia(trigger.count);

    const [randomResource] = createResource(fetchTrigger, fetchRandomMedia);

    createEffect(() => {
        if (!randomResource.loading && !randomResource.error) {
            addItems(randomResource());
        }
    });

    createEffect(() => {
        if (intervalId !== -1) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(
            () => setFetchTrigger({ id: createUniqueId(), count: 1 }),
            mediaSettings.slideshowDisplayDurationSeconds * 1000
        );
    });

    createEffect(() => {
        if (activeItemIsLast()) {
            setFetchTrigger({ id: createUniqueId(), count: 5 });
        }
    });

    onCleanup(() => {
        clearInterval(intervalId);
    });

    return <>{c()}</>;
};

export default MediaRandomLoader;
