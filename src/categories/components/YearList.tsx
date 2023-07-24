import { Component, For } from 'solid-js';

import { useCategoryListViewSettingsContext } from '../../contexts/settings/CategoryListViewSettingsContext';
import { Category } from '../../_models/Category';

import CategoryListItem from '../../components/categories/CategoryListItem';

type Props = {
    year: number;
    categories: Category[];
};

const YearList: Component<Props> = (props) => {
    const [settings] = useCategoryListViewSettingsContext();

    return(
        <>
            <h3 class="h3">{props.year}</h3>
            <div class="divider m-y-[.4rem]" />

            <div>
                <For each={props.categories}>{ category =>
                    <CategoryListItem category={category} thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
};

export default YearList;
