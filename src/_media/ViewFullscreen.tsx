import { Component, Show, onCleanup } from "solid-js";

import { IMediaService } from "./services/IMediaService";
import { SlideshowService } from "./services/SlideshowService";

import FullscreenToolbar from "./ToolbarFullscreen";
import Toolbar from "./Toolbar";
import Layout from "../_components/layout/Layout";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
}

const ViewFullscreen: Component<Props> = props => {
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
                            moveNext={() => props.mediaService.moveNext()}
                            movePrevious={() => props.mediaService.movePrevious()}
                            toggleSlideshow={props.slideshowService.toggle}
                        />
                    </Toolbar>
                }
            >
                <div class="grid h-screen w-full justify-center">
                    <MainItem
                        media={props.mediaService.getActiveMedia()!}
                        moveNext={() => props.mediaService.moveNext()}
                        movePrevious={() => props.mediaService.movePrevious()}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewFullscreen;
