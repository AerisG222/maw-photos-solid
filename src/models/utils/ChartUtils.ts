import { PhotoCategory } from '../api/PhotoCategory';
import { VideoCategory } from '../api/VideoCategory';

// https://www.learnui.design/tools/data-color-picker.html
export const chartColors = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',

    '#5c1f1f',
    '#772c24',
    '#913c27',
    '#ab4d28',
    '#c36126',
    '#da7621',
    '#ee8d18',
    '#ffa600',

    '#0e5c00',
    '#346900',
    '#537600',
    '#728200',
    '#938d00',
    '#b69700',
    '#da9f00',
    '#ffa600',

    '#05005c',
    '#550062',
    '#89005f',
    '#b40056',
    '#d61449',
    '#ee4c38',
    '#fc7a22',
    '#ffa600',
];

export const buildStatsData = (years: number[], categories: PhotoCategory[] | VideoCategory[], valueFunc: (Category) => number) => {
    const result = [];

    for(const year of years) {
        const yearId = `year-${year}`;
        const categoriesInYear = categories.filter(x => x.year === year);

        const yearPoint = {
            id: yearId,
            name: year.toString(),
            value: 0,
            color: chartColors[year % chartColors.length]
        };

        result.push(yearPoint);

        for(const cat of categoriesInYear) {
            result.push({
                id: `year-${year}-${cat.id}`,
                parent: yearId,
                name: cat.name,
                value: valueFunc(cat)
            })

            yearPoint.value += valueFunc(cat);
        }
    }

    return result;
}
