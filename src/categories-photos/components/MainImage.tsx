import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../contexts/PhotoEffectsContext';
import { Photo } from '../../models/Media';

type Props = {
    photo: Photo;
    maxHeightStyle?: string;
};

const MainImage: Component<Props> = (props) => {
    const [, { getFilterStyles, getTransformStyles }] = usePhotoEffectsContext();

    const getSrcset = () => {
        const set = [];

        if (props.photo) {
            set.push(`${props.photo.imageXsUrl} ${props.photo.imageXsWidth}w`);
            set.push(`${props.photo.imageSmUrl} ${props.photo.imageSmWidth}w`);
            set.push(`${props.photo.imageMdUrl} ${props.photo.imageMdWidth}w`);
            set.push(`${props.photo.imageLgUrl} ${props.photo.imageLgWidth}w`);
        }

        return set.join(', ');
    }

    return (
        <img src={props.photo?.imageMdUrl}
            srcset={getSrcset()}
            sizes="100vw"
            class="h-100% w-100% max-h-100vh max-w-100% object-contain self-center"
            style={`${props.maxHeightStyle ?? ''} ${getFilterStyles()} ${getTransformStyles()}`}
            loading="eager" />
    );
}

export default MainImage;
