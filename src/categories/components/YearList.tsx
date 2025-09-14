import { Component, For } from "solid-js";

import { useCategoryListViewSettingsContext } from "../../_contexts/settings/CategoryListViewSettingsContext";
import { Category } from "../../_models/Category";
import { EAGER_THRESHOLD } from "../../_models/utils/Constants";

import CategoryListItem from "../../_components/categories/CategoryListItem";
import YearHeading from "./YearHeading";

interface Props {
    year: number;
    categories: Category[];
    enableEagerLoading: boolean;
    setIsFavorite: (category: Category, isFavorite: boolean) => void;
}

const YearList: Component<Props> = props => {
    const [settings] = useCategoryListViewSettingsContext();

    return (
        <>
            <YearHeading year={props.year} />

            <div class="mb-4">
                <For each={props.categories}>
                    {(category, idx) => (
                        <CategoryListItem
                            category={category}
                            thumbnailSize={settings.thumbnailSize}
                            dimThumbnails={settings.dimThumbnails}
                            eager={props.enableEagerLoading && idx() <= EAGER_THRESHOLD}
                            setIsFavorite={props.setIsFavorite}
                        />
                    )}
                </For>
            </div>
        </>
    );
};

export default YearList;
