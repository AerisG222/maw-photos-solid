import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';
import { categoriesPhotosGrid, getPhotoCategoryRoutePath } from '../../_routes';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MoveNextButton: Component = () => {
    const navigate = useNavigate();
    const [state, {activePhotoIsLast, getNextPhoto}] = usePhotoListContext();

    const moveNext = () => {
        const next = getNextPhoto();

        if(next) {
            // todo: update to build path based on current view mode
            navigate(getPhotoCategoryRoutePath(categoriesPhotosGrid, next.categoryId, next.id));
        }
    }

    return (
        <ToolbarButton
            disabled={activePhotoIsLast()}
            icon="i-ic-round-chevron-right"
            name="Move Next (&rarr;)"
            shortcutKeys={['arrowright']}
            clickHandler={moveNext}
        />
    );
}

export default MoveNextButton;
