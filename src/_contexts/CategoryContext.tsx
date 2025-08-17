import {
    batch,
    createContext,
    createEffect,
    createMemo,
    on,
    ParentComponent,
    useContext
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { Category } from "../_models/Category";
import { FilterFunction, SortFunction } from "../_models/UtilityTypes";
import { useCategoryFilterSettingsContext } from "./settings/CategoryFilterSettingsContext";
import { Media } from "../_models/Media";

export type CategoryState = {
    readonly initialized: boolean;
    readonly categories: Category[];
    readonly filters: FilterFunction[];
    readonly sort?: SortFunction;
    readonly activeCategory?: Category;
};

const sortByIdDesc = {
    name: "sortByIdDesc",
    sortFn: (a: Category, b: Category) => b.effectiveDate.getTime() - a.effectiveDate.getTime()
};

export const defaultCategoryState: CategoryState = {
    initialized: false,
    categories: [],
    filters: [],
    sort: sortByIdDesc,
    activeCategory: undefined
};

export type CategoryContextValue = [
    state: CategoryState,
    actions: {
        setInitialized: (isInitialized: boolean) => void;

        clearCategories: () => void;
        setCategories: (categories: Category[]) => void;
        addCategories: (categories: Category[]) => void;
        updateCategory: (category: Category) => void;

        clearSort: () => void;
        setSort: (sort: SortFunction) => void;

        getAllYears: () => number[];
        getFilteredYears: () => number[];

        getFilteredAndSortedCategories: () => Category[];
        getFilteredCategoriesForYear: (year: number) => Category[];

        setActiveCategory: (category: Category | undefined) => void;
        setActiveCategoryById: (categoryId: Uuid | undefined) => void;

        updateTeaser: (categoryId: Uuid, media: Media) => void;
    }
];

const CategoryContext = createContext<CategoryContextValue>();

export const CategoryProvider: ParentComponent = props => {
    const [state, setState] = createStore(defaultCategoryState);

    const setInitialized = (isInitialized: boolean) => {
        setState({ initialized: isInitialized });
    };

    const clearCategories = () => {
        setState({ categories: [] });
    };

    const setCategories = (categories: Category[]) => {
        setState({ categories });
    };

    const addCategories = (categories: Category[]) => {
        if (categories) {
            setState(s => ({ categories: [...s.categories, ...categories] }));
        }
    };

    const updateCategory = (category: Category) => {
        if (category) {
            setState("categories", cat => cat.id === category.id, reconcile(category));
        }
    };

    const clearFilters = () => {
        setState({ filters: [] });
    };

    const addFilter = (filter: FilterFunction) => {
        setState({ filters: [...state.filters, filter] });
    };

    const removeFilter = (filterName: string) => {
        const idx = state.filters.findIndex(f => f.name === filterName);

        if (idx >= 0) {
            setState(s => ({ filters: s.filters.toSpliced(idx, 1) }));
        }
    };

    const clearSort = () => {
        setState({ sort: undefined });
    };

    const setSort = (sort: SortFunction) => {
        setState({ sort });
    };

    const getAllYears = createMemo(() =>
        [...new Set(state.categories.map(c => c.effectiveDate.getFullYear()))].sort().reverse()
    );

    const getFilteredCategories = createMemo(() => {
        if (state.filters.length === 0) {
            return state.categories;
        }

        const filtered = [];

        for (const category of state.categories) {
            let include = true;

            for (const filter of state.filters) {
                if (!filter.filterFn(category)) {
                    include = false;
                    break;
                }
            }

            if (include) {
                filtered.push(category);
            }
        }

        return filtered;
    });

    const getFilteredAndSortedCategories = createMemo(() => {
        const filteredCategories = getFilteredCategories();

        return state.sort ? [...filteredCategories].sort(state.sort.sortFn) : filteredCategories;
    });

    const getFilteredYears = createMemo(() =>
        [...new Set(getFilteredCategories().map(c => c.effectiveDate.getFullYear()))]
            .sort()
            .reverse()
    );

    const getFilteredCategoriesForYear = (year: number) =>
        getFilteredAndSortedCategories().filter(c => c.effectiveDate.getFullYear() === year);

    const setActiveCategory = (category: Category | undefined) => {
        setState({ activeCategory: category });
    };

    const setActiveCategoryById = (categoryId: Uuid | undefined) => {
        if (categoryId) {
            const cat = state.categories.find(c => c.id === categoryId);

            setActiveCategory(cat);
        } else {
            setActiveCategory(undefined);
        }
    };

    const updateTeaser = (categoryId: Uuid, media: Media) => {
        setState("categories", cat => cat.id === categoryId, "teaser", media);
    };

    const YEAR_FILTER = "YearFilter_Year";
    const GPS_FILTER = "gps-filter";
    const [filter] = useCategoryFilterSettingsContext();

    createEffect(
        on(
            () => filter.yearFilter,
            yearFilter => {
                batch(() => {
                    removeFilter(YEAR_FILTER);

                    if (yearFilter !== "all") {
                        addFilter({
                            name: YEAR_FILTER,
                            filterFn: (c: Category) => c.effectiveDate.getFullYear() === yearFilter
                        });
                    }
                });
            }
        )
    );

    createEffect(
        on(
            () => filter.missingGpsFilter,
            missingGpsFilter => {
                removeFilter(GPS_FILTER);

                if (missingGpsFilter) {
                    // addFilter({
                    //     name: GPS_FILTER,
                    //     filterFn: (c: Category) => c.isMissingGpsData
                    // });
                }
            }
        )
    );

    return (
        <CategoryContext.Provider
            value={[
                state,
                {
                    setInitialized,

                    clearCategories,
                    setCategories,
                    addCategories,
                    updateCategory,

                    clearSort,
                    setSort,

                    getAllYears,
                    getFilteredYears,
                    getFilteredAndSortedCategories,
                    getFilteredCategoriesForYear,

                    setActiveCategory,
                    setActiveCategoryById,

                    updateTeaser
                }
            ]}
        >
            {props.children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => {
    const ctx = useContext(CategoryContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("Category context not provided by ancestor component!");
};
