import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { CategoryListViewSettingsState, defaultCategoryListViewSettings, loadCategoryListViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type CategoryListViewSettingsContextValue = [
    state: CategoryListViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const CategoryListViewSettingsContext = createContext<CategoryListViewSettingsContextValue>([
    defaultCategoryListViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const CategoryListSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadCategoryListViewSettings());

    const setMargin = (margin: Margin) => {
        setState({margin: margin});
    };

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    return (
        <CategoryListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </CategoryListViewSettingsContext.Provider>
    );
}

export const useCategoryListViewSettings = () => useContext(CategoryListViewSettingsContext);
