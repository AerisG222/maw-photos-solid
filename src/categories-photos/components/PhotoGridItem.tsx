import { Component } from 'solid-js';
import { Photo } from '../../models/api/Photo';
import { ThumbnailSizeIdType, allThumbnailSizes } from '../../models/ThumbnailSize';
import { equalsIgnoreCase } from '../../models/Utils';

export type Props = {
    photo: Photo,
    thumbnailSize: ThumbnailSizeIdType
}

const PhotoGridItem: Component<Props> = (props) => {
    const thumbnailClass = () => allThumbnailSizes
        .filter(x => equalsIgnoreCase(x.id, props.thumbnailSize))
        .map(x => x.klass)[0];

    return (
        <img class="block rounded-1" classList={thumbnailClass()} src={props.photo.imageXsSq.url} />
    );
};

export default PhotoGridItem;
