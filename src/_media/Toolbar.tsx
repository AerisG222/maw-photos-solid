import { JSXElement, ParentComponent, Show, children, createMemo } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { IMediaService } from "./services/IMediaService";
import {
    MediaView,
    MediaViewBulkEdit,
    MediaViewFullscreen,
    MediaViewGrid,
    MediaViewMap
} from "../_models/MediaView";

import NavGroup, { NavEntry } from "../_components/toolbar/NavGroup";
import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../_components/toolbar/ToolbarLayout";

interface Props {
    mediaService: IMediaService;
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    // sits ahead of the view links, for a choice they are subordinate to - a
    // face feed puts its media / categories switch here
    leading?: JSXElement;
    /*
       How many navigation entries the `leading` slot holds, so the view links
       carry on numbering from there instead of starting over at 1. Callers pass
       the count exported by whatever they put in the slot.
    */
    leadingNavCount?: number;
}

/*
   The order the views are offered in. Grid first because it is where browsing
   starts, and because it is the one every feed has.
*/
const viewOrder: MediaView[] = [
    MediaViewGrid,
    MediaViewFullscreen,
    MediaViewMap,
    MediaViewBulkEdit
];

const Toolbar: ParentComponent<Props> = props => {
    const [, { setView: setViewMode }] = useMediaPageSettingsContext();
    const [, { gteMd }] = useMediaBreakpointContext();

    const c = children(() => props.children);
    // resolved once - see the note in ToolbarGrid on reading a slot twice
    const leading = children(() => props.leading);

    /*
       Only the views this feed actually offers, in one list, so the digits are
       positional over what is on screen. Below `md` that is the grid alone -
       which keeps the grid on 1 either way, since everything hidden comes after
       it.
    */
    const entries = createMemo<NavEntry[]>(() => {
        const available = props.mediaService.getAvailableRoutes();

        return viewOrder
            .filter(view => view === MediaViewGrid || gteMd())
            .map(view => ({ view, route: available.find(r => r.mediaView === view) }))
            .filter(
                (candidate): candidate is { view: MediaView; route: MediaAppRouteDefinition } =>
                    !!candidate.route
            )
            .map(({ view, route }) => ({
                route,
                href: route.buildPathForMedia(props.activeCategory, props.activeMedia),
                clickHandler: () => setViewMode(view)
            }));
    });

    return (
        <ToolbarLayout>
            <Show when={leading()}>
                {leading()}
                <ToolbarDivider />
            </Show>

            <NavGroup entries={entries()} digitOffset={props.leadingNavCount ?? 0} />

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
