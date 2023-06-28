import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../contexts/PhotoEffectsContext';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

type Props = {
    maxHeightStyle?: string
};

const MainImage: Component<Props> = (props) => {
    const [photoListState] = usePhotoListContext();
    const [photoEffectsState, { getFilterStyles, getTransformStyles }] = usePhotoEffectsContext();

    const getSrcset = () => {
        const set = [];

        if (photoListState.activePhoto) {
            set.push(`${photoListState.activePhoto.imageXsUrl} ${photoListState.activePhoto.imageXsWidth}w`);
            set.push(`${photoListState.activePhoto.imageSmUrl} ${photoListState.activePhoto.imageSmWidth}w`);
            set.push(`${photoListState.activePhoto.imageMdUrl} ${photoListState.activePhoto.imageMdWidth}w`);
            set.push(`${photoListState.activePhoto.imageLgUrl} ${photoListState.activePhoto.imageLgWidth}w`);
        }

        return set.join(', ');
    }

    return (
        <img src={photoListState.activePhoto?.imageMdUrl}
            srcset={getSrcset()}
            sizes="100vw"
            class="h-100% w-100% max-w-100% object-contain self-center"
            style={`${props.maxHeightStyle ?? ''} ${getFilterStyles()} ${getTransformStyles()}`}
            loading="eager" />
    );
}

export default MainImage;
