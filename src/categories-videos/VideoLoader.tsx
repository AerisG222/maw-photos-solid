import { ParentComponent, children, createEffect, createResource } from 'solid-js';

import { getVideos } from '../api/VideoCategories';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useMediaListContext } from '../contexts/MediaListContext';

type Props = {
    categoryId: number;
    videoId: number | undefined;
};

const VideoLoader: ParentComponent<Props> = (props) => {
    const [videosResource] = createResource(props.categoryId, getVideos);
    const [, { setActiveVideoCategory }] = useCategoryContext();
    const [items, { setItems, setActiveItem }] = useMediaListContext();

    const c = children(() => props.children);

    createEffect(() => {
        setActiveVideoCategory(props.categoryId);

        if(!videosResource.loading && !videosResource.error) {
            setItems(videosResource());
        } else {
            if(items?.activeItem?.categoryId !== props.categoryId) {
                setItems([]);
            }
        }

        setActiveItem(props.videoId);
    });

    return (
        <>
            {c()}
        </>
    );
};

export default VideoLoader;
