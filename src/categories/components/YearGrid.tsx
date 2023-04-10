import { Component, For } from 'solid-js';

import { PhotoCategory } from '../../models/api/PhotoCategory';
import CategoryCard from './CategoryCard';
import { useCategoryGridViewSettings } from '../../contexts/CategoryGridViewSettingsContext';

export type Props = {
    year: number;
    categories: PhotoCategory[]
}
const YearGrid: Component<Props> = (props) => {
    const [settings] = useCategoryGridViewSettings();

    return(
        <>
            <h3 class="h3">{props.year}</h3>
            <div class="divider" />

            <div class="flex flex-gap-2 flex-wrap place-content-center">
                <For each={props.categories}>{ category =>
                    <CategoryCard category={category} showTitles={settings.showTitles} thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
}

export default YearGrid;
