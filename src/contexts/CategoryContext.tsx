import { createContext, createMemo, ParentComponent, useContext } from 'solid-js';
import { createStore, unwrap } from "solid-js/store";

import { PhotoCategory } from '../models/api/PhotoCategory';
import { VideoCategory } from '../models/api/VideoCategory';
import { Category, ICategory } from '../models/Category';
import { CategoryTypeFilterIdType, getCategoryTypeFilter } from '../models/CategoryTypeFilter';
import { YearFilterIdType, yearFilterPredicate } from '../models/YearFilter';
import { buildStatsData } from '../models/utils/ChartUtils';
import { Photo } from '../models/api/Photo';
import { Video } from '../models/api/Video';

export type CategoryState = {
    readonly photoCategories: Category<PhotoCategory>[];
    readonly videoCategories: Category<VideoCategory>[];
    readonly activeCategory: ICategory;
};

export const defaultCategoryState: CategoryState = {
    photoCategories: [],
    videoCategories: [],
    activeCategory: undefined
};

export type CategoryContextValue = [
    state: CategoryState,
    actions: {
        setPhotoCategories: (photoCategories: PhotoCategory[]) => void;
        setVideoCategories: (videooCategories: VideoCategory[]) => void;

        getAllCategories: () => ICategory[];
        getPhotoCategoryYears: () => number[];
        getVideoCategoryYears: () => number[];
        getAllYears: () => number[];
        getCategories: (year: YearFilterIdType, type: CategoryTypeFilterIdType) => ICategory[];
        getYears: (year: YearFilterIdType, type: CategoryTypeFilterIdType) => number[];
        setActiveCategory: (category: ICategory) => void;
        setActivePhotoCategory: (categoryId: number) => void;
        setActiveVideoCategory: (categoryId: number) => void;
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
        updateTeaser: (photoOrVideo: Photo | Video) => void;
    }
];

const CategoryContext = createContext<CategoryContextValue>([
    defaultCategoryState,
    {
        setPhotoCategories: () => undefined,
        setVideoCategories: () => undefined,
        getAllCategories: () => undefined,
        getPhotoCategoryYears: () => undefined,
        getVideoCategoryYears: () => undefined,
        getAllYears: () => undefined,
        getCategories: () => undefined,
        getYears: () => undefined,
        setActiveCategory: () => undefined,
        setActivePhotoCategory: () => undefined,
        setActiveVideoCategory: () => undefined,
        getPhotoCount: () => undefined,
        getPhotoFileSize: () => undefined,
        getVideoCount: () => undefined,
        getVideoFileSize: () => undefined,
        getVideoDuration: () => undefined,
        getCombinedCount: () => undefined,
        getCombinedFileSize: () => undefined,
        getPhotoStatsChartData: () => undefined,
        getVideoStatsChartData: () => undefined,
        getCombinedStatsChartData: () => undefined,
        updateTeaser: () => undefined
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

    const getPhotoCategoryYears = createMemo(() => [
            ...new Set(state.photoCategories.map(c => c.year))
        ].sort()
        .reverse()
    );

    const getPhotoCount = createMemo(() =>
        state.photoCategories.reduce<number>((prev, category) => prev + category.actual.photoCount, 0)
    );

    const getVideoCount = createMemo(() =>
        state.videoCategories.reduce<number>((prev, category) => prev + category.actual.videoCount, 0)
    );

    const getCombinedCount = createMemo(() =>
        getPhotoCount() + getVideoCount()
    );

    const getPhotoFileSize = createMemo(() =>
        state.photoCategories.reduce<number>((prev, category) => prev + category.actual.totalSize, 0)
    );

    const getVideoFileSize = createMemo(() =>
        state.videoCategories.reduce<number>((prev, category) => prev + category.actual.totalSize, 0)
    );

    const getCombinedFileSize = createMemo(() =>
        getPhotoFileSize() + getVideoFileSize()
    );

    const getVideoDuration = createMemo(() =>
        state.videoCategories.reduce<number>((prev, category) => prev + category.actual.totalDuration, 0)
    );

    const getVideoCategoryYears = createMemo(() => [
            ...new Set(state.videoCategories.map(c => c.year))
        ].sort()
        .reverse()
    );

    const getAllYears = createMemo(() => [
            ...new Set(getAllCategories().map(c => c.year))
        ].sort()
        .reverse()
    );

    // todo: can we memoize?
    const getCategories = (year: YearFilterIdType, type: CategoryTypeFilterIdType) => getAllCategories()
        .filter(c => getCategoryTypeFilter(type).filter(c) && yearFilterPredicate(c, year))
        .sort(c => c.id)
        .reverse();

    const getYears = (year: YearFilterIdType, type: CategoryTypeFilterIdType) => [
        ...new Set(getCategories(year, type)
            .map(x => x.year)
    )];

    const setActiveCategory = (category: ICategory) => {
        setState({ activeCategory: category })
    };

    const setActivePhotoCategory = (categoryId: number) => {
        const cat = state.photoCategories.find(x => x.id === categoryId);

        setActiveCategory(cat);
    };

    const setActiveVideoCategory = (categoryId: number) => setActiveCategory(state.videoCategories.find(x => x.id === categoryId));

    const getPhotoStatsChartData = (valueFunc: (cat: PhotoCategory) => number) =>
        buildStatsData(getPhotoCategoryYears(), state.photoCategories.map(x => x.actual), valueFunc);

    const getVideoStatsChartData = (valueFunc: (cat: VideoCategory) => number) =>
        buildStatsData(getVideoCategoryYears(), state.videoCategories.map(x => x.actual), valueFunc);

    const getCombinedStatsChartData = (valueFunc: (cat: Category) => number) =>
        buildStatsData(getAllYears(), getAllCategories().map(x => x.actual), valueFunc);

    // todo - trying to update the teaser for the active category is not showing the updated teaser in the category teaser chooser
    const updateTeaser = (photoOrVideo: Photo | Video) => {
        if(state.activeCategory.type === 'photo') {
            setState(
                'photoCategories',
                cat => cat.id === state.activeCategory.id,
                cat => {
                    cat.actual.teaserImage = (photoOrVideo as Photo).imageXs;
                    cat.actual.teaserImageSq = (photoOrVideo as Photo).imageXsSq;

                    return cat;
                }
            );
        }

        if(state.activeCategory.type === 'video') {
            setState(
                'videoCategories',
                cat => cat.id === state.activeCategory.id,
                cat => {
                    cat.actual.teaserImage = (photoOrVideo as Video).thumbnail;
                    cat.actual.teaserImageSq = (photoOrVideo as Video).thumbnailSq;

                    return cat;
                }
            );
        }
    }

    return (
        <CategoryContext.Provider value={[state, {
            setPhotoCategories,
            setVideoCategories,
            getAllCategories,
            getPhotoCategoryYears,
            getVideoCategoryYears,
            getAllYears,
            getCategories,
            getYears,
            setActiveCategory,
            setActivePhotoCategory,
            setActiveVideoCategory,
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
}

export const useCategoryContext = () => useContext(CategoryContext);
