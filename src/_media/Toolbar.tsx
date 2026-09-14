import { JSXElement, ParentComponent, Show, children, createMemo } from "solid-js";

import { useMediaSettingsContext } from "../_contexts/settings/MediaSettingsContext";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { MediaAppRouteDefinition } from "../_models/MediaAppRouteDefinition";
import { IMediaService } from "./services/IMediaService";
import { MediaView, MediaViewBulkEdit, MediaViewGrid, MediaViewMap } from "../_models/MediaView";

import ItemActions from "../_components/listing/ItemActions";
import { usePanelShape } from "../_components/overlay/SidePanel";
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
const viewOrder: MediaView[] = [MediaViewGrid, MediaViewMap, MediaViewBulkEdit];

const Toolbar: ParentComponent<Props> = props => {
    const [, { setView: setViewMode }] = useMediaSettingsContext();
    const { docked } = usePanelShape();

    const c = children(() => props.children);
    // resolved once - see the note in ToolbarGrid on reading a slot twice
    const leading = children(() => props.leading);

    /*
       Only the views this feed actually offers, in one list, so the digits are
       positional over what is on screen.

       Nearly every view, at nearly every width. A phone used to be offered the
       grid and nothing else - no fullscreen, no map, no bulk edit - which is a
       strange thing to do to the device most likely to be holding the
       photographs. For three of the four the chrome was the problem, not the
       view, and the chrome is fixed.

       Bulk edit is the real exception. Its whole job is to pick photographs
       from the grid and type one set of coordinates for all of them, which
       means reading the selection and the form at the same time. That only
       works where the tools sit *beside* the photographs rather than over them
       - which is exactly where the panel docks, so that is the test.
    */
    const entries = createMemo<NavEntry[]>(() => {
        const available = props.mediaService.getAvailableRoutes();

        return viewOrder
            .filter(view => view !== MediaViewBulkEdit || docked())
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
        <ToolbarLayout
            nav={
                <>
                    {leading()}

                    {/*
                        Only between two things. A feed's view links collapse to
                        nothing when the grid is all it offers, and a divider
                        with one side is a line hanging off the end of the bar.
                    */}
                    <Show when={leading() && entries().length > 1}>
                        <ToolbarDivider />
                    </Show>

                    <NavGroup entries={entries()} digitOffset={props.leadingNavCount ?? 0} />
                </>
            }
            /*
               In the bar at every width rather than folded into the sheet: it
               is already one button hiding a menu, so putting it behind a
               second one would be two taps to reach a download.

               Here rather than in each view's own toolbar: this is the one
               place that knows both the photograph and the category it belongs
               to, so every view gets these without threading a prop through
               three toolbars to reach them. Shown when either scope has
               something to offer - a photograph is selected, or a whole
               category is what is being browsed, since a category grid with
               nothing picked can still be downloaded.
            */
            actions={
                <Show when={!!props.activeMedia || props.mediaService.canDownloadCategory()}>
                    <ToolbarDivider />

                    <ItemActions
                        activeMedia={props.activeMedia}
                        activeCategory={props.activeCategory}
                        canDownloadCategory={props.mediaService.canDownloadCategory()}
                    />
                </Show>
            }
        >
            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
