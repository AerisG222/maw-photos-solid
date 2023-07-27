import { ParentComponent, batch, children, createEffect, onCleanup } from 'solid-js';
import { useParams } from '@solidjs/router';

import { useMediaListContext } from './contexts/MediaListContext';
import { MediaTypePhoto, MediaTypeVideo } from '../_models/Media';
import { photoMediaService } from '../_services/media/PhotoMediaService';
import { videoMediaService } from '../_services/media/VideoMediaService';
import { useRatingServiceContext } from './contexts/RatingServiceContext';
import { useExifServiceContext } from './contexts/ExifServiceContext';
import { useCommentServiceContext } from './contexts/CommentServiceContext';
import { useMetadataEditServiceContext } from './contexts/MetadataEditServiceContext';

const ActiveMediaMonitor: ParentComponent = (props) => {
    const params = useParams();
    const [mediaList, { setActiveItem, setItems }] = useMediaListContext();
    const [, { setService: setCommentService }] = useCommentServiceContext();
    const [, { setService: setRatingService }] = useRatingServiceContext();
    const [, { setService: setExifService }] = useExifServiceContext();
    const [, { setService: setMetadataEditService }] = useMetadataEditServiceContext();

    const c = children(() => props.children);

    // note: wanted to simply put this in the top level category, but we need this to be defined
    // in an element/component that is a child of the mediaListContext...
    createEffect(() => {
        setActiveItem(params.id ? parseInt(params.id, 10) : undefined);
    });

    createEffect(() => {
        batch(() => {
            switch(mediaList.activeItem?.kind) {
                case MediaTypePhoto:
                    setRatingService(photoMediaService);
                    setCommentService(photoMediaService);
                    setExifService(photoMediaService);
                    setMetadataEditService(photoMediaService);
                    break;
                case MediaTypeVideo:
                    setRatingService(videoMediaService);
                    setCommentService(videoMediaService);
                    setMetadataEditService(videoMediaService);
                    setExifService(undefined);
                    break;
            }
        })
    });

    onCleanup(() => {
        batch(() => {
            setActiveItem(undefined);
            setItems([]);
        });
    });

    return (
        <>
            {c()}
        </>
    );
};

export default ActiveMediaMonitor;
