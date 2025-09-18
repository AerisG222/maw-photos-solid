import { Component, Show } from "solid-js";

import { Media } from "../../_models/Media";
import { Category } from "../../_models/Category";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
}

const CategoryTeaserCard: Component<Props> = props => {
    const { setCategoryTeaserMutation } = useCategoriesContext();

    const onSetTeaser = async (evt: Event) => {
        evt.preventDefault();

        if (props.activeCategory) {
            const req = {
                category: props.activeCategory,
                media: props.activeMedia!
            };

            await setCategoryTeaserMutation.mutateAsync(req);
        }
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
