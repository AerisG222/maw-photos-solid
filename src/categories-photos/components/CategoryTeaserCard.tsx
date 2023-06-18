import { Component } from 'solid-js';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { setTeaser } from '../../api/PhotoCategories';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

const CategoryTeaserCard: Component = () => {
    const [categoryState, {updateTeaser}] = useCategoryContext();
    const [listState] = usePhotoListContext();

    const onSetTeaser = async (evt: Event) => {
        evt.preventDefault();

        await setTeaser(categoryState.activeCategory.id, listState.activePhoto.id);
        updateTeaser(listState.activePhoto);
    }

    return (
        <>
            <p>Current Teaser:</p>

            <div class="text-center">
                <img class="mt-2 mx-auto center" src={categoryState.activeCategory?.teaserImageSq?.url} />

                <button class="btn btn-sm mt-2" onClick={onSetTeaser}>
                    Replace with Active Photo
                </button>
            </div>
        </>
    );
}

export default CategoryTeaserCard;
