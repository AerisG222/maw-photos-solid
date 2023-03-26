import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { CategoryGridViewSettingsState, defaultCategoryGridViewSettings, loadCategoryGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type CategoryGridViewSettingsContextValue = [
    state: CategoryGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setShowTitles: (showTitles: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const CategoryGridViewSettingsContext = createContext<CategoryGridViewSettingsContextValue>([
    defaultCategoryGridViewSettings,
    {
        setMargin: () => undefined,
        setShowTitles: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const CategoryGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadCategoryGridViewSettings());

    const setMargin = (margin: Margin) => {
        setState({margin: margin});
    };

    const setShowTitles = (showTitles: boolean) => {
        setState({showTitles: showTitles});
    }

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    return (
        <CategoryGridViewSettingsContext.Provider value={[state, { setMargin, setShowTitles, setThumbnailSize }]}>
            {props.children}
        </CategoryGridViewSettingsContext.Provider>
    );
}

export const useCategoryGridViewSettings = () => useContext(CategoryGridViewSettingsContext);
