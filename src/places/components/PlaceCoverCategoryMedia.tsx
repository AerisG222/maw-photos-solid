import { Component, Match, Show, Switch } from "solid-js";

import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";
import { ThumbnailSizeSmall } from "../../_models/ThumbnailSize";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";
import { Uuid } from "../../_models/Uuid";

import CoverCandidateGrid from "./CoverCandidateGrid";
import ErrorMessage from "../../_components/error/ErrorMessage";
import Icon from "../../_components/icon/Icon";
import SkeletonGrid from "../../_components/loading/SkeletonGrid";

interface Props {
    category: Category;
    coverMediaId: Uuid | null | undefined;
    disabled: boolean;
    onChoose: (media: Media) => void;
    onBack: () => void;
}

/*
   One category's media, as candidates for a place's cover.

   The whole category is shown rather than only the part taken at the place: the
   API knows which of these are eligible and says so, and filtering here would
   need a coordinate per photograph that no listing carries. Choosing one taken
   elsewhere is refused with an explanation rather than silently accepted, which
   is the one case worth warning about up front.
*/
const PlaceCoverCategoryMedia: Component<Props> = props => {
    const { categoryMediaQuery } = useCategoriesContext();

    const categoryId = () => props.category.id;
    // eslint-disable-next-line solid/reactivity -- an accessor, and the query re-keys itself when the category changes
    const media = categoryMediaQuery(categoryId);

    return (
        <>
            <div class="flex items-center gap-2 mb-2">
                <button class="btn btn-xs" onClick={() => props.onBack()}>
                    <Icon classes="icon-[ic--round-arrow-back]" />
                    Categories
                </button>

                <span class="text-sm font-bold truncate">
                    {props.category.name} ({props.category.year})
                </span>
            </div>

            <Switch fallback={<SkeletonGrid thumbnailSize={ThumbnailSizeSmall} count={12} />}>
                <Match when={media.isError}>
                    <ErrorMessage
                        title="Could not load this category"
                        error={media.error}
                        onRetry={() => void media.refetch()}
                    />
                </Match>

                <Match when={media.isSuccess}>
                    <Show
                        when={(media.data?.length ?? 0) > 0}
                        fallback={<p class="text-center my-8">This category is empty.</p>}
                    >
                        <p class="text-xs opacity-70 mb-2">
                            A category can span several places. Anything here that was taken
                            somewhere else cannot be this place's cover, and choosing it says so.
                        </p>

                        <CoverCandidateGrid
                            items={media.data!}
                            coverMediaId={props.coverMediaId}
                            disabled={props.disabled}
                            onChoose={props.onChoose}
                        />
                    </Show>
                </Match>
            </Switch>
        </>
    );
};

export default PlaceCoverCategoryMedia;
