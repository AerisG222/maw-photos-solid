import { ParentComponent, Show, children, createMemo } from "solid-js";

import { useMediaPageSettingsContext } from "../_contexts/settings/MediaPageSettingsContext";
import { useMediaBreakpointContext } from "../_contexts/MediaBreakpointContext";
import { Media } from "../_models/Media";
import { Category } from "../_models/Category";
import { IMediaService } from "./services/IMediaService";
import {
    MediaViewModeGrid,
    MediaViewModeDetail,
    MediaViewModeFullscreen,
    MediaViewModeMap,
    MediaViewModeBulkEdit
} from "./models/MediaView";

import ToolbarDivider from "../_components/toolbar/ToolbarDivider";
import ToolbarLayout from "../_components/toolbar/ToolbarLayout";
import ToolbarLink from "../_components/toolbar/ToolbarLink";

type Props = {
    mediaService: IMediaService;
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
};

const Toolbar: ParentComponent<Props> = props => {
    const [, { setView: setViewMode }] = useMediaPageSettingsContext();
    const [, { gteMd }] = useMediaBreakpointContext();

    const c = children(() => props.children);

    const mediaViewDetail = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewModeDetail)
    );
    const mediaViewFullscreen = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewModeFullscreen)
    );
    const mediaViewGrid = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewModeGrid)
    );
    const mediaViewMap = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewModeMap)
    );
    const mediaViewBulkEdit = createMemo(() =>
        props.mediaService.getAvailableRoutes().find(r => r.mediaView === MediaViewModeBulkEdit)
    );

    return (
        <ToolbarLayout>
            <Show when={mediaViewGrid()}>
                <ToolbarLink
                    href={mediaViewGrid()!.buildPathForMedia(
                        props.activeCategory,
                        props.activeMedia
                    )}
                    route={mediaViewGrid()!}
                    clickHandler={() => setViewMode(MediaViewModeGrid)}
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
                        clickHandler={() => setViewMode(MediaViewModeDetail)}
                    />
                </Show>

                <Show when={mediaViewFullscreen()}>
                    <ToolbarLink
                        href={mediaViewFullscreen()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewFullscreen()!}
                        clickHandler={() => setViewMode(MediaViewModeFullscreen)}
                    />
                </Show>

                <Show when={mediaViewMap()}>
                    <ToolbarLink
                        href={mediaViewMap()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewMap()!}
                        clickHandler={() => setViewMode(MediaViewModeMap)}
                    />
                </Show>

                <Show when={mediaViewBulkEdit()}>
                    <ToolbarLink
                        href={mediaViewBulkEdit()!.buildPathForMedia(
                            props.activeCategory,
                            props.activeMedia
                        )}
                        route={mediaViewBulkEdit()!}
                        clickHandler={() => setViewMode(MediaViewModeBulkEdit)}
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
