import { Component } from 'solid-js';

import { AppRouteDefinition } from '../../models/AppRouteDefinition';
import { Video, Media } from '../../models/Media';
import { ThumbnailSizeIdType, getThumbnailClass } from '../../models/ThumbnailSize';
import { getMediaPath } from '../../media/_routes';
import { CategoryTypeVideos } from '../../models/CategoryType';

import MediaLink from '../../media/MediaLink';

type Props = {
    video: Video;
    thumbnailSize: ThumbnailSizeIdType;
    rounded: boolean;
    isActiveItem: boolean;
    route: AppRouteDefinition;
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

    // todo: make category type dynamic?
    return (
        <MediaLink
            media={props.video}
            scroll={props.scroll}
            url={getMediaPath(props.route, CategoryTypeVideos, props.video.categoryId, props.video.id)}
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
