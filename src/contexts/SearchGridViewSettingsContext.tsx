import { createContext, ParentComponent, useContext } from 'solid-js';
import { createStore } from "solid-js/store";

import { Margin } from '../models/margin';
import { SearchGridViewSettingsState, defaultSearchGridViewSettings, loadSearchGridViewSettings } from '../models/settings';
import { ThumbnailSize } from '../models/thumbnail-size';

export type SearchGridViewSettingsContextValue = [
    state: SearchGridViewSettingsState,
    actions: {
        setMargin: (margin: Margin) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSize) => void;
    }
];

const SearchGridViewSettingsContext = createContext<SearchGridViewSettingsContextValue>([
    defaultSearchGridViewSettings,
    {
        setMargin: () => undefined,
        setShowTitles: () => undefined,
        setShowYears: () => undefined,
        setThumbnailSize: () => undefined
    }
]);

export const SearchGridSettingsProvider: ParentComponent = (props) => {
    const [state, setState] = createStore(loadSearchGridViewSettings());

    const setMargin = (margin: Margin) => {
        setState({margin: margin});
    };

    const setShowTitles = (showTitles: boolean) => {
        setState({showTitles: showTitles});
    }

    const setShowYears = (showYears: boolean) => {
        setState({showTitles: showYears});
    }

    const setThumbnailSize = (thumbnailSize: ThumbnailSize) => {
        setState({thumbnailSize: thumbnailSize});
    }

    return (
        <SearchGridViewSettingsContext.Provider value={[state, { setMargin, setShowTitles, setShowYears, setThumbnailSize }]}>
            {props.children}
        </SearchGridViewSettingsContext.Provider>
    );
}

export const useSearchGridViewSettings = () => useContext(SearchGridViewSettingsContext);
