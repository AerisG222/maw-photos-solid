import { createContext, createMemo, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoCategory } from '../models/api/PhotoCategory';
import { VideoCategory } from '../models/api/VideoCategory';
import { adaptPhotoCategories, adaptVideoCategories, Category } from '../models/Category';
import { CategoryTypeFilterIdType, getCategoryTypeFilter, yearFilterPredicate } from '../models/CategoryTypeFilter';

export type CategoryState = {
    readonly photoCategories: Category[];
    readonly videoCategories: Category[];
};

export const defaultCategoryState: CategoryState = {
    photoCategories: [],
    videoCategories: [],
};

export type CategoryContextValue = [
    state: CategoryState,
    actions: {
        setPhotoCategories: (photoCategories: PhotoCategory[]) => void;
        setVideoCategories: (videooCategories: VideoCategory[]) => void;
        getAllCategories: () => Category[];
        getAllYears: () => number[];
        getCategoriesForYearAndTypeFilter: (year: number, type: CategoryTypeFilterIdType) => Category[];
    }
];

const CategoryContext = createContext<CategoryContextValue>([
    defaultCategoryState,
    {
        setPhotoCategories: () => undefined,
        setVideoCategories: () => undefined,
        getAllCategories: () => undefined,
        getAllYears: () => undefined,
        getCategoriesForYearAndTypeFilter: () => undefined,
    }
]);

export const CategoryProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultCategoryState);

    const setPhotoCategories = (photoCategories: PhotoCategory[]) => {
        setState({ photoCategories: adaptPhotoCategories(photoCategories)});
    };

    const setVideoCategories = (videoCategories: VideoCategory[]) => {
        setState({ videoCategories: adaptVideoCategories(videoCategories)});
    }

    const getAllCategories = createMemo(() => {
        return [
            ...state.photoCategories,
            ...state.videoCategories
        ];
    });

    const getAllYears = createMemo(() => [
        ...new Set(getAllCategories().map(c => c.year))
    ].sort());

    const getCategoriesForYearAndTypeFilter = (year: number, type: CategoryTypeFilterIdType) => getAllCategories()
        .filter(c => getCategoryTypeFilter(type).filter(c) && yearFilterPredicate(c, year))
        .sort(c => c.id);

    return (
        <CategoryContext.Provider value={[state, { setPhotoCategories, setVideoCategories, getAllCategories, getAllYears, getCategoriesForYearAndTypeFilter }]}>
            {props.children}
        </CategoryContext.Provider>
    );
}

export const useCategory = () => useContext(CategoryContext);