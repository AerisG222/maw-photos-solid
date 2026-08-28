import { Component, JSXElement, Show } from "solid-js";

import { MediaDetailViewSettingsState } from "../_contexts/settings/MediaDetailViewSettingsContext";
import { detailRoute } from "../category/_routes";
import { SlideshowService } from "./services/SlideshowService";
import { IMediaService } from "./services/IMediaService";
import { Media } from "../_models/Media";
import { MediaViewDetail } from "../_models/MediaView";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { useMediaContext } from "../_contexts/api/MediaContext";

import DetailToolbar from "./ToolbarDetail";
import Toolbar from "./Toolbar";
import CategoryBreadcrumb from "../_components/categories/CategoryBreadcrumb";
import Sidebar from "./detail/Sidebar";
import Layout from "../_components/layout/Layout";
import MediaList from "./MediaList";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    detailSettings: MediaDetailViewSettingsState;
    // controls belonging to the feed rather than to this view, e.g. the filters
    // on a person's media - see the note in ViewGrid
    toolbarExtras?: JSXElement;
    // rendered ahead of the view links - see Toolbar
    toolbarLeading?: JSXElement;
    showBreadcrumbTitleAsLink: boolean;
    enableCategoryTeaserChooser: boolean;
    // see the note on the same prop in ToolbarDetail
    enableCategoryDownload: boolean;
    showFavoritesBadge: boolean;
    setShowFavoritesBadge: () => void;
}

const ViewDetail: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();

    let mediaElement: HTMLImageElement | HTMLVideoElement | undefined;

    const setIsFavorite = (media: Media, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Media> = {
            item: media,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    /*
       Gated on the media alone. Requiring the category as well tore the whole
       view down between photos in a person or clan feed: consecutive items there
       usually belong to different categories, so moving next re-keys the category
       query and leaves this undefined until it answers. The toolbar, the
       filmstrip and its scroll position were all rebuilt on every move.

       Nothing below needs it to exist - the breadcrumb, the sidebar and the
       download button each treat it as optional already.
    */
    return (
        <Show when={props.mediaService.getActiveMedia()}>
            <Layout
                xPad={false}
                fill
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        leading={props.toolbarLeading}
                    >
                        <DetailToolbar
                            extras={props.toolbarExtras}
                            enableCategoryDownload={props.enableCategoryDownload}
                            activeCategory={props.mediaService.getActiveCategory()}
                            activeMedia={props.mediaService.getActiveMedia()}
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={props.slideshowService.isPlaying()}
                            canRequestMore={props.mediaService.canRequestMore()}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={() => props.slideshowService.toggle()}
                            requestMore={() => props.mediaService.requestMore()}
                            setShowFavoritesBadge={() => props.setShowFavoritesBadge()}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Sidebar
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        enableCategoryTeaser={props.enableCategoryTeaserChooser}
                        mediaElement={mediaElement}
                        requestMoveNext={() => props.mediaService.moveNext()}
                    />
                }
            >
                <div class="flex flex-col h-full min-h-0">
                    <Show when={props.detailSettings.showBreadcrumbs} fallback={<div />}>
                        <CategoryBreadcrumb
                            category={props.mediaService.getActiveCategory()}
                            showTitleAsLink={props.showBreadcrumbTitleAsLink}
                        />
                    </Show>

                    <div class="flex flex-1 min-h-0 justify-center">
                        <MainItem
                            media={props.mediaService.getActiveMedia()!}
                            highlightFaces={props.detailSettings.highlightFaces}
                            showFavoriteBadge={props.showFavoritesBadge}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            setActiveMediaElement={el => (mediaElement = el)}
                            setIsFavorite={setIsFavorite}
                        />
                    </div>

                    <Show when={props.detailSettings.showMediaList} fallback={<div />}>
                        <MediaList
                            mediaLinkBuilder={(media: Media) =>
                                props.mediaService.getMediaPathByView(MediaViewDetail, media)
                            }
                            media={props.mediaService.getMediaList()}
                            activeMedia={props.mediaService.getActiveMedia()!}
                            thumbnailSize={props.detailSettings.thumbnailSize}
                            dimThumbnails={props.detailSettings.dimThumbnails}
                            showTypesBadge={false}
                            activeRoute={detailRoute}
                        />
                    </Show>
                </div>
            </Layout>
        </Show>
    );
};

export default ViewDetail;
