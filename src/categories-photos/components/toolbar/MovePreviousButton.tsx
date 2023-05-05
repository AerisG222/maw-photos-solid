import { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { usePhotoListContext } from '../../../contexts/PhotoListContext';
import { categoriesPhotosGrid, getPhotoCategoryRoutePath } from '../../_routes';

import ToolbarButton from '../../../components/toolbar/ToolbarButton';

const MovePreviousButton: Component = () => {
    const navigate = useNavigate();
    const [state, {activePhotoIsFirst, getPreviousPhoto}] = usePhotoListContext();

    const movePrevious = () => {
        const prev = getPreviousPhoto();

        if(prev) {
            // todo: update to build path based on current view mode
            navigate(getPhotoCategoryRoutePath(categoriesPhotosGrid, prev.categoryId, prev.id));
        }
    }

    return (
        <ToolbarButton
            disabled={activePhotoIsFirst()}
            icon="i-ic-round-chevron-left"
            name="Move Previous"
            clickHandler={movePrevious}
        />
    );
}

export default MovePreviousButton;
