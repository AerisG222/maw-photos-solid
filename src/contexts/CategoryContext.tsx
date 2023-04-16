import { createContext, createMemo, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { PhotoCategory } from '../models/api/PhotoCategory';
import { VideoCategory } from '../models/api/VideoCategory';
import { Category, ICategory } from '../models/Category';
import { CategoryTypeFilterIdType, getCategoryTypeFilter } from '../models/CategoryTypeFilter';
import { YearFilterIdType, yearFilterPredicate } from '../models/YearFilter';

export type CategoryState = {
    readonly photoCategories: Category<PhotoCategory>[];
    readonly videoCategories: Category<VideoCategory>[];
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
        getAllCategories: () => ICategory[];
        getAllYears: () => number[];
        getCategories: (year: YearFilterIdType, type: CategoryTypeFilterIdType) => ICategory[];
        getYears: (year: YearFilterIdType, type: CategoryTypeFilterIdType) => number[];
    }
];

const CategoryContext = createContext<CategoryContextValue>([
    defaultCategoryState,
    {
        setPhotoCategories: () => undefined,
        setVideoCategories: () => undefined,
        getAllCategories: () => undefined,
        getAllYears: () => undefined,
        getCategories: () => undefined,
        getYears: () => undefined,
    }
]);

export const CategoryProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(defaultCategoryState);

    const setPhotoCategories = (photoCategories: PhotoCategory[]) => {
        setState({ photoCategories: photoCategories.map(x => new Category<PhotoCategory>(x, 'photo')) });
    };

    const setVideoCategories = (videoCategories: VideoCategory[]) => {
        setState({ videoCategories: videoCategories.map(x => new Category<VideoCategory>(x, 'video')) });
    }

    const getAllCategories = createMemo(() => {
        return [
            ...(state.photoCategories as ICategory[]),
            ...(state.videoCategories as ICategory[])
        ];
    });

    const getAllYears = createMemo(() => [
        ...new Set(getAllCategories().map(c => c.year))
    ].sort()
    .reverse());

    // todo: can we memoize?
    const getCategories = (year: YearFilterIdType, type: CategoryTypeFilterIdType) => getAllCategories()
        .filter(c => getCategoryTypeFilter(type).filter(c) && yearFilterPredicate(c, year))
        .sort(c => c.id)
        .reverse();

    const getYears = (year: YearFilterIdType, type: CategoryTypeFilterIdType) => [
        ...new Set(getCategories(year, type)
            .map(x => x.year)
    )];

    return (
        <CategoryContext.Provider value={[state, {
            setPhotoCategories,
            setVideoCategories,
            getAllCategories,
            getAllYears,
            getCategories,
            getYears
        }]}>
            {props.children}
        </CategoryContext.Provider>
    );
}

export const useCategory = () => useContext(CategoryContext);
