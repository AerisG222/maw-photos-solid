import { Component, JSXElement, Show, createSignal } from "solid-js";

import { IMediaService } from "./services/IMediaService";
import { SlideshowService } from "./services/SlideshowService";
import { useMediaContext } from "../_contexts/api/MediaContext";
import { Media } from "../_models/Media";
import { IsFavoriteRequest } from "../_models/IsFavoriteRequest";
import { MediaViewFullscreen } from "../_models/MediaView";

import MediaToolbar from "./MediaToolbar";
import Toolbar from "./Toolbar";
import Inspector from "../_components/inspector/Inspector";
import Layout from "../_components/layout/Layout";
import MainItem from "./MainItem";

interface Props {
    mediaService: IMediaService;
    slideshowService: SlideshowService;
    // controls belonging to the feed rather than to this view, e.g. the filters
    // on a person's media - see the note in ViewGrid
    toolbarExtras?: JSXElement;
    // rendered ahead of the view links - see Toolbar
    toolbarLeading?: JSXElement;
    // how many navigation entries `toolbarLeading` holds - see Toolbar
    toolbarLeadingNavCount?: number;
}

const ViewFullscreen: Component<Props> = props => {
    const { setIsFavoriteMutation } = useMediaContext();
    // read here rather than threaded from every caller: all three of them hand
    // this view the same context's values already

    /*
       A signal rather than a plain variable, for the same reason the detail view
       keeps one - see the note there. The histogram card reads its pixels off
       this element, and it can now be opened here too.
    */
    const [mediaElement, setMediaElement] = createSignal<
        HTMLImageElement | HTMLVideoElement | undefined
    >();

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
                        leading={props.toolbarLeading}
                        leadingNavCount={props.toolbarLeadingNavCount}
                    >
                        <MediaToolbar
                            view={MediaViewFullscreen}
                            mediaService={props.mediaService}
                            slideshowService={props.slideshowService}
                            extras={props.toolbarExtras}
                        />
                    </Toolbar>
                }
                sidebar={
                    <Inspector
                        view={MediaViewFullscreen}
                        activeCategory={props.mediaService.getActiveCategory()}
                        activeMedia={props.mediaService.getActiveMedia()}
                        mediaElement={mediaElement()}
                        requestMoveNext={() => props.mediaService.moveNext()}
                    />
                }
            >
                <div class="grid h-dvh w-full justify-center">
                    <MainItem
                        media={props.mediaService.getActiveMedia()!}
                        moveNext={() => props.mediaService.moveNext()}
                        movePrevious={() => props.mediaService.movePrevious()}
                        setActiveMediaElement={el => setMediaElement(el)}
                        setIsFavorite={setIsFavorite}
                    />
                </div>
            </Layout>
        </Show>
    );
};

export default ViewFullscreen;
