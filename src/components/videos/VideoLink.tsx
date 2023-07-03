import { Component } from 'solid-js';

import { AppRouteDefinition } from '../../models/AppRouteDefinition';
import { Video, Media } from '../../models/Media';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';

import MediaLink from '../media/MediaLink';
import { getVideoCategoryRoutePath } from '../../categories-videos/_routes';

type Props = {
    video: Video;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition
    scroll?: (el: HTMLAnchorElement, media: Media) => void;
};

const VideoLink: Component<Props> = (props) => {
    const getClassList = () => ({
        ...getThumbnailClass(props.thumbnailSize),
        ...{
            'max-w-none': true,
            'rounded-1': props.rounded
        }
    });

    return (
        <MediaLink
            media={props.video}
            scroll={props.scroll}
            url={getVideoCategoryRoutePath(props.route, props.video.categoryId, props.video.id)}
            rounded={props.rounded}
            isActiveItem={props.isActiveItem}>
            <img
                src={props.video.thumbnailSqUrl}
                classList={getClassList()}
                loading="lazy" />
        </MediaLink>
    );
};

export default VideoLink;
