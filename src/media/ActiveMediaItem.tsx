import { ParentComponent, children, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';

import { useMediaListContext } from '../contexts/MediaListContext';

// todo: naming...
const ActiveMediaItem: ParentComponent = (props) => {
    const params = useParams();
    const [, { setActiveItem }] = useMediaListContext();

    const c = children(() => props.children);

    // note: wanted to simply put this in the top level category, but we need this to be defined
    // in an element/component that is a child of the mediaListContext...
    createEffect(() => {
        setActiveItem(params.id ? parseInt(params.id, 10) : undefined);
    });

    return (
        <>
            {c()}
        </>
    );
};

export default ActiveMediaItem;
