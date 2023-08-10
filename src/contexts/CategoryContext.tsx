import { createContext, createMemo, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { Category } from "../_models/Category";
import { CategoryType } from "../_models/CategoryType";
import { FilterFunction, SortFunction } from "../_models/UtilityTypes";

export type CategoryState = {
    readonly initialized: boolean;
    readonly categories: Category[];
    readonly filters: FilterFunction[];
    readonly sort?: SortFunction;
    readonly activeCategory?: Category;
};

const sortByIdDesc = {
    name: "sortByIdDesc",
    sortFn: (a: Category, b: Category) => b.id - a.id
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

        updateTeaser: (categoryType: CategoryType, categoryId: number, teaserImageUrl: string) => void;
    }
];

const CategoryContext = createContext<CategoryContextValue>();

export const CategoryProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultCategoryState);

    const setInitialized = (isInitialized: boolean) => {
        setState({initialized: isInitialized});
    };

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

    const setActiveCategory = (category: Category) => {
        setState({ activeCategory: category })
    };

    const setActiveCategoryById = (categoryType: CategoryType, categoryId: number) => {
        const cat = state.categories.find(c => c.type === categoryType && c.id === categoryId);

        setActiveCategory(cat);
    };

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
            setInitialized,

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

            updateTeaser
        }]}>
            {props.children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
