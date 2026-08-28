import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_FEED_VIEW_CATEGORY, loadJson, saveJson } from "./_storage";

/*
   The categories listing of a person or clan feed. Its own settings rather than
   the search page's or the media grid's: it draws category cards like the search
   results do, but somebody browsing faces is making a different choice about
   what they want to see than somebody searching.
*/
export interface FeedCategoryViewSettingsState {
    readonly margin: MarginIdType;
    readonly showTitles: boolean;
    readonly showYears: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly showFavoritesBadge: boolean;
    readonly showTypesBadge: boolean;
}

export const defaultFeedCategoryViewSettings: FeedCategoryViewSettingsState = {
    margin: defaultMargin,
    showTitles: true,
    showYears: true,
    thumbnailSize: defaultGridThumbnailSize,
    dimThumbnails: true,
    showFavoritesBadge: false,
    showTypesBadge: false
};

export type FeedCategoryViewSettingsContextValue = [
    state: FeedCategoryViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowTitles: (showTitles: boolean) => void;
        setShowYears: (showYears: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setShowFavoritesBadge: (showBadge: boolean) => void;
        setShowTypesBadge: (showBadge: boolean) => void;
    }
];

const FeedCategoryViewSettingsContext = createContext<FeedCategoryViewSettingsContextValue>();

export const FeedCategorySettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setShowTitles = (showTitles: boolean) => updateState({ showTitles });
    const setShowYears = (showYears: boolean) => updateState({ showYears });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });
    const setShowFavoritesBadge = (showFavoritesBadge: boolean) =>
        updateState({ showFavoritesBadge });
    const setShowTypesBadge = (showTypesBadge: boolean) => updateState({ showTypesBadge });

    const updateState = (update: Partial<FeedCategoryViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <FeedCategoryViewSettingsContext.Provider
            value={[
                state,
                {
                    setMargin,
                    setShowTitles,
                    setShowYears,
                    setThumbnailSize,
                    setDimThumbnails,
                    setShowFavoritesBadge,
                    setShowTypesBadge
                }
            ]}
        >
            {props.children}
        </FeedCategoryViewSettingsContext.Provider>
    );
};

export const useFeedCategoryViewSettingsContext = () => {
    const ctx = useContext(FeedCategoryViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("FeedCategoryViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultFeedCategoryViewSettings,
        ...loadJson(KEY_SETTINGS_FEED_VIEW_CATEGORY, defaultFeedCategoryViewSettings)
    };
}

function saveState(state: FeedCategoryViewSettingsState) {
    saveJson(KEY_SETTINGS_FEED_VIEW_CATEGORY, state);
}
