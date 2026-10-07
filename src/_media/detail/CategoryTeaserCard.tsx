import { Component, createEffect, on, Show } from "solid-js";

import { Media } from "../../_models/Media";
import { Category } from "../../_models/Category";
import { getMediaTeaserUrl } from "../../_models/utils/MediaUtils";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { describeError, getRefusalMessage } from "../../_contexts/api/ApiError";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
}

const CategoryTeaserCard: Component<Props> = props => {
    const { setCategoryTeaserMutation } = useCategoriesContext();

    const onSetTeaser = (evt: Event) => {
        evt.preventDefault();

        if (props.activeCategory) {
            const req = {
                category: props.activeCategory,
                media: props.activeMedia!
            };

            // mutate rather than mutateAsync - a refusal is shown below, not thrown
            setCategoryTeaserMutation.mutate(req);
        }
    };

    // a refusal belongs to the photo it was for, not to the next one
    createEffect(
        on(
            () => props.activeMedia?.id,
            () => setCategoryTeaserMutation.reset(),
            { defer: true }
        )
    );

    // a restricted photo is refused as a teaser, which everyone who can see the
    // category is shown
    const errorMessage = () => {
        const error = setCategoryTeaserMutation.error;

        return error ? (getRefusalMessage(error) ?? describeError(error)) : undefined;
    };

    return (
        <>
            <p>Current:</p>

            <Show when={props.activeCategory}>
                <div class="text-center">
                    <img
                        class="mt-2 mx-auto center"
                        src={getMediaTeaserUrl(props.activeCategory!.teaser)}
                        alt={props.activeCategory!.name}
                    />

                    <button class="btn btn-outline btn-primary btn-sm mt-2" onClick={onSetTeaser}>
                        Replace with Active Photo
                    </button>

                    <Show when={errorMessage()}>
                        <p class="text-sm text-error mt-2">{errorMessage()}</p>
                    </Show>
                </div>
            </Show>
        </>
    );
};

export default CategoryTeaserCard;
