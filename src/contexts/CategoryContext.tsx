import { createContext, createMemo, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Category, PhotoCategory, VideoCategory } from '../models/Category';
import { buildStatsData } from '../models/utils/ChartUtils';
import { CategoryType } from '../models/CategoryType';
import { FilterFunction, SortFunction } from '../models/UtilityTypes';

export type CategoryState = {
    readonly categories: Category[];
    readonly filters: FilterFunction[];
    readonly sort?: SortFunction;
    readonly activeCategory?: Category;
};

export const defaultCategoryState: CategoryState = {
    categories: [],
    filters: [],
    sort: undefined,
    activeCategory: undefined
};

export type CategoryContextValue = [
    state: CategoryState,
    actions: {
        clearCategories: () => void;
        setCategories: (categories: Category[]) => void;
        addCategories: (categories: Category[]) => void;

        clearFilters: () => void;
        addFilter: (filter: FilterFunction) => void;
        removeFilter: (name: string) => void;

        clearSort: () => void;
        setSort: (sort: SortFunction) => void;

        getAllYears: () => number[];
        getFilteredYears: () => number[];

        getFilteredAndSortedCategories: () => Category[];
        getFilteredCategoriesForYear: (year: number) => Category[];

        setActiveCategory: (category: Category) => void;
        setActiveCategoryById: (categoryType: CategoryType, categoryId: number) => void;

        // hmmm... move these to components?
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

        updateTeaser: (categoryType: CategoryType, categoryId: number, teaserImageUrl: string) => void;
    }
];

const CategoryContext = createContext<CategoryContextValue>();

export const CategoryProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultCategoryState);

    const clearCategories = () => {
        setState({ categories: [] });
    };

    const setCategories = (categories: Category[]) => {
        setState({ categories });
    };

    const addCategories = (categories: Category[]) => {
        if(categories) {
            setState(s => ({ categories: [...s.categories, ...categories] }));
        }
    };

    const clearFilters = () => {
        setState({ filters: [] });
    };

    const addFilter = (filter: FilterFunction) => {
        setState({ filters: [...state.filters, filter ]});
    };

    const removeFilter = (filterName: string) => {
        const idx = state.filters.findIndex(f => f.name === filterName);

        if(idx >= 0) {
            setState(s => ({ filters: s.filters.toSpliced(idx, 1) }))
        }
    };

    const clearSort = () => {
        setState({ sort: undefined });
    };

    const setSort = (sort: SortFunction) => {
        setState({ sort });
    };

    const getAllYears = createMemo(() => [
            ...new Set(state.categories.map(c => c.year))
        ].sort()
        .reverse()
    );

    const getFilteredCategories = createMemo(() => {
        if(state.filters.length === 0) {
            return state.categories;
        }

        const filtered = [];

        for(const category of state.categories) {
            let include = true;

            for(const filter of state.filters) {
                if(!filter.filterFn(category)) {
                    include = false;
                    break;
                }
            }

            if(include) {
                filtered.push(category);
            }
        }

        return filtered;
    });

    const getFilteredAndSortedCategories = createMemo(() => {
        const filteredCategories = getFilteredCategories();

        return state.sort ?
            filteredCategories.sort(state.sort.sortFn) :
            filteredCategories;
    });

    const getFilteredYears = createMemo(() => [
            ...new Set(getFilteredCategories().map(c => c.year))
        ].sort()
        .reverse()
    );

    const getFilteredCategoriesForYear = (year: number) => getFilteredAndSortedCategories().filter(c => c.year === year);

    const getPhotoCategories = createMemo(() => state.categories.filter(c => c.type === "photo") as PhotoCategory[]);
    const getVideoCategories = createMemo(() => state.categories.filter(c => c.type === "video") as VideoCategory[]);

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

    const setActiveCategory = (category: Category) => {
        setState({ activeCategory: category })
    };

    const setActiveCategoryById = (categoryType: CategoryType, categoryId: number) => {
        const cat = state.categories.find(c => c.type === categoryType && c.id === categoryId);

        setActiveCategory(cat);
    };

    const getPhotoStatsChartData = (valueFunc: (cat: PhotoCategory) => number) =>
        buildStatsData(getPhotoCategoryYears(), getPhotoCategories(), valueFunc);

    const getVideoStatsChartData = (valueFunc: (cat: VideoCategory) => number) =>
        buildStatsData(getVideoCategoryYears(), getVideoCategories(), valueFunc);

    const getCombinedStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getAllYears(), state.categories, valueFunc);

    // todo - trying to update the teaser for the active category is not showing the updated teaser in the category teaser chooser
    const updateTeaser = (categoryType: CategoryType, categoryId: number, teaserImageUrl: string) => {
        setState(
            "categories",
            cat => cat.type === categoryType && cat.id === categoryId,
            "teaserImageUrl",
            teaserImageUrl
        );
    };

    return (
        <CategoryContext.Provider value={[state, {
            clearCategories,
            setCategories,
            addCategories,

            clearFilters,
            addFilter,
            removeFilter,

            clearSort,
            setSort,

            getAllYears,
            getFilteredYears,
            getFilteredAndSortedCategories,
            getFilteredCategoriesForYear,

            setActiveCategory,
            setActiveCategoryById,

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

            updateTeaser
        }]}>
            {props.children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
