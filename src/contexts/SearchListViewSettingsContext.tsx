import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { SearchListViewSettingsState, defaultSearchListViewSettings, loadSearchListViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type SearchListViewSettingsContextValue = [
    state: SearchListViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const SearchListViewSettingsContext = createContext<SearchListViewSettingsContextValue>([
    defaultSearchListViewSettings,
    {
        setMargin: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const SearchListSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadSearchListViewSettings());

    const setMargin = (margin: Margin) => {
        setState({margin: margin});
    };

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    return (
        <SearchListViewSettingsContext.Provider value={[state, { setMargin, setThumbnailSize }]}>
            {props.children}
        </SearchListViewSettingsContext.Provider>
    );
}

export const useSearchListViewSettings = () => useContext(SearchListViewSettingsContext);
