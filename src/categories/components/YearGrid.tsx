import { Component, For } from 'solid-js';

import { useCategoryGridViewSettingsContext } from '../../contexts/settings/CategoryGridViewSettingsContext';
import { Category } from '../../models/Category';
import { defaultGridThumbnailSize } from '../../models/ThumbnailSize';

import CategoryCard from './CategoryCard';

type Props = {
    year: number;
    categories: Category[];
};

const YearGrid: Component<Props> = (props) => {
    const [settings] = useCategoryGridViewSettingsContext();

    return(
        <>
            <h3 class="h3">{props.year}</h3>
            <div class="divider m-y-[.4rem]" />

            <div class="flex flex-gap-2 flex-wrap place-content-center mb-4">
                <For each={props.categories}>{ category =>
                    <CategoryCard category={category} showTitles={settings.showTitles && settings.thumbnailSize === defaultGridThumbnailSize} thumbnailSize={settings.thumbnailSize} />
                }</For>
            </div>
        </>
    );
};

export default YearGrid;
