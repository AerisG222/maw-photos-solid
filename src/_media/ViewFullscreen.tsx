import { Component, Show } from "solid-js";

import { IMediaService } from "./services/IMediaService";
import { SlideshowService } from "./services/SlideshowService";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { Media } from "../_models/Media";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";

import FullscreenToolbar from "./ToolbarFullscreen";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    showFavoritesBadge: boolean;
    setShowFavoritesBadge: () => void;
}

const ViewFullscreen: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();

    const setIsFavorite = (media: Media, isFavorite: boolean) => {
        const req: IsFavoriteRequest<Media> = {
            item: media,
            isFavorite
        };

        setIsFavoriteMutation.mutate(req);
    };

    return (
        <Show when={props.mediaService.getActiveMedia()}>
            <Layout
                xPad={false}
                toolbar={
                    <Toolbar
                        mediaService={props.mediaService}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                    >
                        <FullscreenToolbar
                            activeMediaIsFirst={props.mediaService.isActiveMediaFirst()}
                            activeMediaIsLast={props.mediaService.isActiveMediaLast()}
                            slideshowIsPlaying={props.slideshowService.isPlaying()}
                            canRequestMore={props.mediaService.canRequestMore()}
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={() => props.slideshowService.toggle()}
                            requestMore={() => props.mediaService.requestMore()}
                            setShowFavoritesBadge={props.setShowFavoritesBadge}
                        />
                    </Toolbar>
                }
            >
                <div class="grid h-screen w-full justify-center">
                    <MainItem
                        media={props.mediaService.getActiveMedia()!}
                        showFavoriteBadge={props.showFavoritesBadge}
                        moveNext={() => props.mediaService.moveNext()}
                        movePrevious={() => props.mediaService.movePrevious()}
                        setIsFavorite={setIsFavorite}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewFullscreen;
