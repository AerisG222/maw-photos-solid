import { Match, ParentComponent, Switch, children } from 'solid-js';

import { useRouteDetailContext } from '../contexts/RouteDetailContext';
import { AreaCategories, AreaRandom } from '../_models/AppRouteDefinition';

import MediaCategoryLoader from './loader/MediaCategoryLoader';
import MediaRandomLoader from './loader/MediaRandomLoader';

const MediaLoader: ParentComponent = (props) => {
    const [routeContext] = useRouteDetailContext()

    const c = children(() => props.children);

    return (
        <Switch>
            <Match when={routeContext.area === AreaCategories}>
                <MediaCategoryLoader>
                    {c()}
                </MediaCategoryLoader>
            </Match>
            <Match when={routeContext.area === AreaRandom}>
                <MediaRandomLoader>
                    {c()}
                </MediaRandomLoader>
            </Match>
        </Switch>
    );
};

export default MediaLoader;
