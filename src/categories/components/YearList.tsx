import { Component, For } from 'solid-js';

import { useCategoryListViewSettings } from '../../contexts/CategoryListViewSettingsContext';
import { ICategory } from '../../models/Category';
import CategoryListItem from './CategoryListItem';

export type Props = {
    year: number;
    categories: ICategory[]
}
const YearList: Component<Props> = (props) => {
    const [settings] = useCategoryListViewSettings();

    return(
        <>
            <h3 class="h3">{props.year}</h3>
            <div class="divider" />

            <div>
                <For each={props.categories}>{ category =>
                    <CategoryListItem category={category} thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
}

export default YearList;
