import { ParentComponent, batch, children, createEffect, onCleanup } from "solid-js";
import { useParams } from "@solidjs/router";

import { useMediaListContext } from "./contexts/MediaListContext";
import { mediaService } from "../_services/media/MediaService";
import { useRatingServiceContext } from "./contexts/RatingServiceContext";
import { useExifServiceContext } from "./contexts/ExifServiceContext";
import { useCommentServiceContext } from "./contexts/CommentServiceContext";
import { useMetadataEditServiceContext } from "./contexts/MetadataEditServiceContext";

const ActiveMediaMonitor: ParentComponent = props => {
    const params = useParams();
    const [mediaList, { setActiveItem, setItems }] = useMediaListContext();
    const [, { setService: setCommentService }] = useCommentServiceContext();
    const [, { setService: setRatingService }] = useRatingServiceContext();
    const [, { setService: setExifService }] = useExifServiceContext();
    const [, { setService: setMetadataEditService }] = useMetadataEditServiceContext();

    const c = children(() => props.children);

    setRatingService(mediaService);
    setCommentService(mediaService);
    setExifService(mediaService);
    setMetadataEditService(mediaService);

    // note: wanted to simply put this in the top level category, but we need this to be defined
    // in an element/component that is a child of the mediaListContext...
    createEffect(() => {
        if (mediaList.items && mediaList.items.length > 0) {
            setActiveItem(params.id ? parseInt(params.id, 10) : undefined);
        }
    });

    onCleanup(() => {
        batch(() => {
            setActiveItem(undefined);
            setItems([]);
        });
    });

    return <>{c()}</>;
};

export default ActiveMediaMonitor;
