import { Component } from 'solid-js';

import { useCategoryContext } from '../../../contexts/CategoryContext';
import { useMediaListContext } from '../../../contexts/MediaListContext';
import { useCategoryTeaserServiceContext } from '../../../contexts/CategoryTeaserServiceContext';

const CategoryTeaserCard: Component = () => {
    const {setTeaser} = useCategoryTeaserServiceContext();
    const [categoryState, {updateTeaser}] = useCategoryContext();
    const [mediaList] = useMediaListContext();

    const onSetTeaser = async (evt: Event) => {
        evt.preventDefault();

        await setTeaser(categoryState.activeCategory.id, mediaList.activeItem.id);
        updateTeaser(mediaList.activeItem);
    }

    return (
        <>
            <p>Current Teaser:</p>

            <div class="text-center">
                <img class="mt-2 mx-auto center" src={categoryState.activeCategory?.teaserImageUrl} />

                <button class="btn btn-sm mt-2" onClick={onSetTeaser}>
                    Replace with Active Photo
                </button>
            </div>
        </>
    );
}

export default CategoryTeaserCard;
