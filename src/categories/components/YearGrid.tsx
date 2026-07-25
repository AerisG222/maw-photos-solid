import { Component, For } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../../_contexts/settings/CategoryGridViewSettingsContext";
import { Category } from "../../_models/Category";
import { defaultGridThumbnailSize } from "../../_models/ThumbnailSize";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";

import CategoryCard from "../../_components/categories/CategoryCard";
import YearHeading from "./YearHeading";

interface Props {
    year: number;
    categories: Category[];
    enableEagerLoading: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

const YearGrid: Component<Props> = props => {
    const [settings] = useCategoryGridViewSettingsContext();

    return (
        <>
            <YearHeading year={props.year} />

            {/*
                The entrance is on the group, not each card. Favoriting refetches
                the list, which gives every category a new identity and makes the
                reference-keyed <For> re-create every card - a per-card animation
                would replay across the whole grid on each heart click. This
                container instance is keyed by year, so it survives the refetch
                and animates only when the year first appears.
            */}
            <div class="flex gap-2 flex-wrap place-content-center mb-4 rise-in">
                <For each={props.categories}>
                    {(category, idx) => (
                        <CategoryCard
                            category={category}
                            showTitles={
                                settings.showTitles &&
                                settings.thumbnailSize === defaultGridThumbnailSize
                            }
                            showYears={false}
                            thumbnailSize={settings.thumbnailSize}
                            dimThumbnails={settings.dimThumbnails}
                            showFavoriteBadge={settings.showFavoritesBadge}
                            showTypesBadge={settings.showTypesBadge}
                            eager={props.enableEagerLoading && idx() <= EAGER_THRESHOLD}
                            setIsFavorite={props.setIsFavorite}
                        />
                    )}
                </For>
            </div>
        </>
    );
};

export default YearGrid;
