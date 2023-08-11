import { Component, For } from "solid-js";

import { useCategoryListViewSettingsContext } from "../../contexts/settings/CategoryListViewSettingsContext";
import { Category } from "../../_models/Category";
import { EAGER_THRESHOLD } from '../../_models/utils/Constants';

import CategoryListItem from "../../components/categories/CategoryListItem";
import YearHeading from "./YearHeading";

type Props = {
    year: number;
    categories: Category[];
    enableEagerLoading: boolean;
};

const YearList: Component<Props> = (props) => {
    const [settings] = useCategoryListViewSettingsContext();

    return(
        <>
            <YearHeading year={props.year} />

            <div class="mb-4">
                <For each={props.categories}>{ (category, idx) =>
                    <CategoryListItem
                        category={category}
                        thumbnailSize={settings.thumbnailSize}
                        eager={props.enableEagerLoading && idx() <= EAGER_THRESHOLD}
                    />
                }</For>
            </div>
        </>
    );
};

export default YearList;
