import { JSXElement, ParentComponent, Show, children, createMemo } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { IMediaService } from "./services/IMediaService";
import {
    MediaViewGrid,
    MediaViewDetail,
    MediaViewFullscreen,
    MediaViewMap,
    MediaViewBulkEdit
} from "../_models/MediaView";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

interface Props {
    mediaService: IMediaService;
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    // sits ahead of the view links, for a choice they are subordinate to - a
    // face feed puts its media / categories switch here
    leading?: JSXElement;
}

const Toolbar: ParentComponent<Props> = props => {
    const [, { setView: setViewMode }] = useMediaPageSettingsContext();
    const [, { gteMd }] = useMediaBreakpointContext();

    const c = children(() => props.children);
    // resolved once - see the note in ToolbarGrid on reading a slot twice
    const leading = children(() => props.leading);

    const mediaViewDetail = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewDetail)
    );
    const mediaViewFullscreen = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewFullscreen)
    );
    const mediaViewGrid = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewGrid)
    );
    const mediaViewMap = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewMap)
    );
    const mediaViewBulkEdit = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewBulkEdit)
    );

    return (
        <ToolbarLayout>
            <Show when={leading()}>
                {leading()}
                <ToolbarDivider />
            </Show>

            <Show when={mediaViewGrid()}>
                <ToolbarLink
                    href={mediaViewGrid()!.buildPathForMedia(
                        props.activeCategory,
                        props.activeMedia
                    )}
                    route={mediaViewGrid()!}
                    clickHandler={() => setViewMode(MediaViewGrid)}
                />
            </Show>

            <Show when={gteMd()}>
                <Show when={mediaViewDetail()}>
                    <ToolbarLink
                        href={mediaViewDetail()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewDetail()!}
                        clickHandler={() => setViewMode(MediaViewDetail)}
                    />
                </Show>

                <Show when={mediaViewFullscreen()}>
                    <ToolbarLink
                        href={mediaViewFullscreen()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewFullscreen()!}
                        clickHandler={() => setViewMode(MediaViewFullscreen)}
                    />
                </Show>

                <Show when={mediaViewMap()}>
                    <ToolbarLink
                        href={mediaViewMap()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewMap()!}
                        clickHandler={() => setViewMode(MediaViewMap)}
                    />
                </Show>

                <Show when={mediaViewBulkEdit()}>
                    <ToolbarLink
                        href={mediaViewBulkEdit()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewBulkEdit()!}
                        clickHandler={() => setViewMode(MediaViewBulkEdit)}
                    />
                </Show>
            </Show>

            <Show when={!!c()}>
                <ToolbarDivider />
                {c()}
            </Show>
        </ToolbarLayout>
    );
};

export default Toolbar;
