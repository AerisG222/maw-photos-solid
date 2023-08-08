import { Category } from "../../_models/Category";

// https://www.learnui.design/tools/data-color-picker.html
// https://medialab.github.io/iwanthue/
export const chartColors = [
    "#486ca6",
    "#d93e92",
    "#6ca3e0",
    "#da4bc8",
    "#4d7ddf",
    "#a54d78",
    "#5b5fde",
    "#dc87c3",
    "#9146d5",
    "#815c97",
    "#ac53c6",
    "#5a55a8",
    "#a04291",
    "#af90e2",
    "#845cbe"
];

export const buildStatsData = (years: number[], categories: Category[], valueFunc: (cat: Category) => number) => {
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
};
