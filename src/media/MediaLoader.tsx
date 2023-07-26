import { ParentComponent, batch, children, createEffect } from 'solid-js';

import { useMediaListContext } from './contexts/MediaListContext';
import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { Area, AreaCategories, AreaRandom } from '../_models/AppRouteDefinition';

import MediaCategoryLoader from './loader/MediaCategoryLoader';
import MediaRandomLoader from './loader/MediaRandomLoader';

const MediaLoader: ParentComponent = (props) => {
    const [routeContext] = useRouteDetailContext()
    const [, { setItems, setActiveItem, }] = useMediaListContext();
    let lastArea: Area = undefined;

    const c = children(() => props.children);

    const getLoader = () => {
        switch(routeContext.area) {
            case AreaCategories:
                return (
                    <MediaCategoryLoader>
                        {c()}
                    </MediaCategoryLoader>
                );
            case AreaRandom:
                return (
                    <MediaRandomLoader>
                        {c()}
                    </MediaRandomLoader>
                );
            default:
                return <></>;
        }
    }

    // if we switch from one area to another, we need to clear out the set of
    // media that may have been loaded already
    createEffect(() => {
        if(lastArea !== routeContext.area) {
            batch(() => {
                lastArea = routeContext.area;
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
