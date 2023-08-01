import { Component, For } from "solid-js";

import { useCategoryGridViewSettingsContext } from "../../contexts/settings/CategoryGridViewSettingsContext";
import { Category } from "../../_models/Category";
import { defaultGridThumbnailSize } from "../../_models/ThumbnailSize";

import CategoryCard from "../../components/categories/CategoryCard";
import YearHeading from "./YearHeading";

type Props = {
    year: number;
    categories: Category[];
};

const YearGrid: Component<Props> = (props) => {
    const [settings] = useCategoryGridViewSettingsContext();

    return(
        <>
            <YearHeading year={props.year} />

            <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
                <For each={props.categories}>{ category =>
                    <CategoryCard
                        category={category}
                        showTitles={settings.showTitles && settings.thumbnailSize === defaultGridThumbnailSize}
                        showYears={false}
                        thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
};

export default YearGrid;
