import { Component, Show } from "solid-js";

import { useCategoryContext } from "../../_contexts/CategoryContext";
import { Media } from "../../_models/Media";
import { Category } from "../../_models/Category";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";

export type CategoryTeaserCardProps = {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
};

const CategoryTeaserCard: Component<CategoryTeaserCardProps> = props => {
    const [categoryState, { updateTeaser }] = useCategoryContext();

    const onSetTeaser = async (evt: Event) => {
        evt.preventDefault();

        // if (categoryState.activeCategory && teaserServiceContext.service) {
        //     await teaserServiceContext.service.setTeaser(
        //         categoryState.activeCategory.id,
        //         mediaList.activeItem.id
        //     );

        //     updateTeaser(
        //         categoryState.activeCategory.type,
        //         categoryState.activeCategory.id,
        //         getMediaTeaserUrl(mediaList.activeItem)
        //     );
        // }
    };

    return (
        <>
            <p>Current:</p>

            <Show when={props.activeCategory}>
                <div class="text-center">
                    <img
                        class="mt-2 mx-auto center"
                        src={getMediaTeaserUrl(props.activeCategory!.teaser, "default")}
                    />

                    <button class="btn btn-outline btn-primary btn-sm mt-2" onClick={onSetTeaser}>
                        Replace with Active Photo
                    </button>
                </div>
            </Show>
        </>
    );
};

export default CategoryTeaserCard;
