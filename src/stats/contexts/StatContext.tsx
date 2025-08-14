import { ParentComponent, createContext, createMemo, useContext } from "solid-js";

import { createStore } from "solid-js/store";
import { useCategoryContext } from "../../contexts/CategoryContext";
import { buildStatsData } from "../../_models/utils/ChartUtils";
import { Category } from "../../_models/Category";

export type StatState = {};

export type StatContextValue = [
    state: StatState,
    actions: {
        getPhotoCategories: () => Category[];
        getPhotoCategoryYears: () => number[];
        getVideoCategories: () => Category[];
        getVideoCategoryYears: () => number[];
        getPhotoCount: () => number;
        getPhotoFileSize: () => number;
        getVideoCount: () => number;
        getVideoFileSize: () => number;
        getVideoDuration: () => number;
        getCombinedCount: () => number;
        getCombinedFileSize: () => number;
        getPhotoStatsChartData: (valueFunc: (cat: Category) => number) => any;
        getVideoStatsChartData: (valueFunc: (cat: Category) => number) => any;
        getCombinedStatsChartData: (valueFunc: (cat: Category) => number) => any;
    }
];

const StatContext = createContext<StatContextValue>();

export const StatProvider: ParentComponent = props => {
    const [state] = createStore({});
    const [categoryContext, { getAllYears }] = useCategoryContext();

    const getPhotoCategories = createMemo(() => categoryContext.categories);
    const getVideoCategories = createMemo(() => categoryContext.categories);

    const getPhotoCategoryYears = createMemo(() => []);
    const getVideoCategoryYears = createMemo(() => []);

    const getPhotoCount = createMemo(() => 1);

    const getVideoCount = createMemo(() => 1);

    const getCombinedCount = createMemo(() => getPhotoCount() + getVideoCount());

    const getPhotoFileSize = createMemo(() => 1);

    const getVideoFileSize = createMemo(() => 1);

    const getCombinedFileSize = createMemo(() => getPhotoFileSize() + getVideoFileSize());

    const getVideoDuration = createMemo(() => 1);

    const getPhotoStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getPhotoCategoryYears(), getPhotoCategories(), valueFunc);

    const getVideoStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getVideoCategoryYears(), getVideoCategories(), valueFunc);

    const getCombinedStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getAllYears(), categoryContext.categories, valueFunc);

    return (
        <StatContext.Provider
            value={[
                state,
                {
                    getPhotoCategories,
                    getPhotoCategoryYears,
                    getVideoCategories,
                    getVideoCategoryYears,
                    getPhotoCount,
                    getPhotoFileSize,
                    getVideoCount,
                    getVideoFileSize,
                    getVideoDuration,
                    getCombinedCount,
                    getCombinedFileSize,
                    getPhotoStatsChartData,
                    getVideoStatsChartData,
                    getCombinedStatsChartData
                }
            ]}
        >
            {props.children}
        </StatContext.Provider>
    );
};

export const useStatContext = () => useContext(StatContext);
