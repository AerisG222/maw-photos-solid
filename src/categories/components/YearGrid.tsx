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
}

const YearGrid: Component<Props> = props => {
    const [settings] = useCategoryGridViewSettingsContext();

    return (
        <>
            <YearHeading year={props.year} />

            <div class="flex gap-2 flex-wrap place-content-center mb-4">
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
                            eager={props.enableEagerLoading && idx() <= EAGER_THRESHOLD}
                        />
                    )}
                </For>
            </div>
        </>
    );
};

export default YearGrid;
