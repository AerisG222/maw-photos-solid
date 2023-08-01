import { Component, For } from "solid-js";

import { useCategoryListViewSettingsContext } from "../../contexts/settings/CategoryListViewSettingsContext";
import { Category } from "../../_models/Category";

import CategoryListItem from "../../components/categories/CategoryListItem";
import YearHeading from "./YearHeading";

type Props = {
    year: number;
    categories: Category[];
};

const YearList: Component<Props> = (props) => {
    const [settings] = useCategoryListViewSettingsContext();

    return(
        <>
            <YearHeading year={props.year} />

            <div>
                <For each={props.categories}>{ category =>
                    <CategoryListItem category={category} thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
};

export default YearList;
