import { ParentComponent, createContext, createMemo, useContext } from "solid-js";

import { Category, PhotoCategory, VideoCategory } from "../../_models/Category";
import { createStore } from "solid-js/store";
import { useCategoryContext } from "../../contexts/CategoryContext";
import { buildStatsData } from "../../_models/utils/ChartUtils";
import { CategoryTypePhotos, CategoryTypeVideos } from "../../_models/CategoryType";

export type StatState = { }

export type StatContextValue = [
    state: StatState,
    actions: {
        getPhotoCategories: () => PhotoCategory[],
        getPhotoCategoryYears: () => number[],
        getVideoCategories: () => VideoCategory[],
        getVideoCategoryYears: () => number[],
        getPhotoCount: () => number;
        getPhotoFileSize: () => number;
        getVideoCount: () => number;
        getVideoFileSize: () => number;
        getVideoDuration: () => number;
        getCombinedCount: () => number;
        getCombinedFileSize: () => number;
        getPhotoStatsChartData: (valueFunc: (cat: PhotoCategory) => number) => any;
        getVideoStatsChartData: (valueFunc: (cat: VideoCategory) => number) => any;
        getCombinedStatsChartData: (valueFunc: (cat: Category) => number) => any;
    }
];

const StatContext = createContext<StatContextValue>();

export const StatProvider: ParentComponent = (props) => {
    const [state] = createStore({});
    const [categoryContext, { getAllYears }] = useCategoryContext();

    const getPhotoCategories = createMemo(() => categoryContext.categories.filter(c => c.type === CategoryTypePhotos) as PhotoCategory[]);
    const getVideoCategories = createMemo(() => categoryContext.categories.filter(c => c.type === CategoryTypeVideos) as VideoCategory[]);

    const getPhotoCategoryYears = createMemo(() => [... new Set(getPhotoCategories().map(c => c.year))]);
    const getVideoCategoryYears = createMemo(() => [... new Set(getVideoCategories().map(c => c.year))]);

    const getPhotoCount = createMemo(() =>
        getPhotoCategories().reduce<number>((prev, category) => prev + category.count, 0)
    );

    const getVideoCount = createMemo(() =>
        getVideoCategories().reduce<number>((prev, category) => prev + category.count, 0)
    );

    const getCombinedCount = createMemo(() =>
        getPhotoCount() + getVideoCount()
    );

    const getPhotoFileSize = createMemo(() =>
        getPhotoCategories().reduce<number>((prev, category) => prev + category.totalSize, 0)
    );

    const getVideoFileSize = createMemo(() =>
        getVideoCategories().reduce<number>((prev, category) => prev + category.totalSize, 0)
    );

    const getCombinedFileSize = createMemo(() =>
        getPhotoFileSize() + getVideoFileSize()
    );

    const getVideoDuration = createMemo(() =>
        getVideoCategories().reduce<number>((prev, category) => prev + category.totalDuration, 0)
    );

    const getPhotoStatsChartData = (valueFunc: (cat: PhotoCategory) => number) =>
        buildStatsData(getPhotoCategoryYears(), getPhotoCategories(), valueFunc);

    const getVideoStatsChartData = (valueFunc: (cat: VideoCategory) => number) =>
        buildStatsData(getVideoCategoryYears(), getVideoCategories(), valueFunc);

    const getCombinedStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getAllYears(), categoryContext.categories, valueFunc);

    return (
        <StatContext.Provider value={[state, {
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
            getCombinedStatsChartData,
        }]}>
            {props.children}
        </StatContext.Provider>
    );
};

export const useStatContext = () => useContext(StatContext);
