import { Component } from 'solid-js';

import { usePhotoEffectsContext } from '../../contexts/PhotoEffectsContext';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

type Props = {
    maxHeightStyle?: string
};

const MainImage: Component<Props> = (props) => {
    const [photoListState] = usePhotoListContext();
    const [photoEffectsState, { getFilterStyles, getTransformStyles }] = usePhotoEffectsContext();

    return (
        <img src={photoListState.activePhoto?.imageMdUrl}
            class="h-100% w-100% max-w-100% object-contain self-center"
            style={`${props.maxHeightStyle ?? ''} ${getFilterStyles()} ${getTransformStyles()}` } />
    );
}

export default MainImage;
