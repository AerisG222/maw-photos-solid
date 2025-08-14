import { Component } from "solid-js";

import { useCategoryContext } from "../../contexts/CategoryContext";
import { useMediaListContext } from "../contexts/MediaListContext";
import { useCategoryTeaserServiceContext } from "../contexts/CategoryTeaserServiceContext";
import { getMediaTeaserUrl } from "../../_models/Media";

const CategoryTeaserCard: Component = () => {
    const [teaserServiceContext] = useCategoryTeaserServiceContext();
    const [categoryState, { updateTeaser }] = useCategoryContext();
    const [mediaList] = useMediaListContext();

    const onSetTeaser = async (evt: Event) => {
        evt.preventDefault();

        if (categoryState.activeCategory && teaserServiceContext.service) {
            await teaserServiceContext.service.setTeaser(
                categoryState.activeCategory.id,
                mediaList.activeItem.id
            );

            updateTeaser(
                categoryState.activeCategory.type,
                categoryState.activeCategory.id,
                getMediaTeaserUrl(mediaList.activeItem)
            );
        }
    };

    return (
        <>
            <p>Current Teaser:</p>

            <div class="text-center">
                <img
                    class="mt-2 mx-auto center"
                    src={categoryState.activeCategory?.teaserImageUrl}
                />

                <button class="btn btn-outline btn-primary btn-sm mt-2" onClick={onSetTeaser}>
                    Replace with Active Photo
                </button>
            </div>
        </>
    );
};

export default CategoryTeaserCard;
