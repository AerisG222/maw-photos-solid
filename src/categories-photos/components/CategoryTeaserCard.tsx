import { Component } from 'solid-js';

import { useCategoryContext } from '../../contexts/CategoryContext';
import { usePhotoListContext } from '../../contexts/PhotoListContext';
import { useCategoryTeaserServiceContext } from '../../contexts/CategoryTeaserServiceContext';

const CategoryTeaserCard: Component = () => {
    const {setTeaser} = useCategoryTeaserServiceContext();
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
                <img class="mt-2 mx-auto center" src={categoryState.activeCategory?.teaserImageUrl} />

                <button class="btn btn-sm mt-2" onClick={onSetTeaser}>
                    Replace with Active Photo
                </button>
            </div>
        </>
    );
}

export default CategoryTeaserCard;
