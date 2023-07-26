import { ParentComponent, batch, children, createEffect } from 'solid-js';

import { useMediaListContext } from '../contexts/MediaListContext';
import { MediaListModeCategory, MediaListModeRandom } from '../_models/Media';

import MediaCategoryLoader from './loader/MediaCategoryLoader';
import MediaRandomLoader from './loader/MediaRandomLoader';

const MediaLoader: ParentComponent = (props) => {
    const [mediaContext, { setItems, setActiveItem, }] = useMediaListContext();
    let lastMode = undefined;

    const c = children(() => props.children);

    const getLoader = () => {
        switch(mediaContext.mode) {
            case MediaListModeCategory:
                return (
                    <MediaCategoryLoader>
                        {c()}
                    </MediaCategoryLoader>
                );
            case MediaListModeRandom:
                return (
                    <MediaRandomLoader>
                        {c()}
                    </MediaRandomLoader>
                );
            default:
                return <></>;
        }
    }

    // if we switch from one mode to another, we need to manually clear out the set of
    // media that may have been loaded already
    createEffect(() => {
        if(lastMode !== mediaContext.mode) {
            batch(() => {
                lastMode = mediaContext.mode;
                setActiveItem(undefined);
                setItems([]);
            });
        }
    });

    return (
        <>
            {getLoader()}
        </>
    );
};

export default MediaLoader;
