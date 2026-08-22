import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { defaultMargin, MarginIdType } from "../../_models/Margin";
import { defaultPersonSort, PersonSortIdType } from "../../_models/PersonSort";
import { defaultGridThumbnailSize, ThumbnailSizeIdType } from "../../_models/ThumbnailSize";
import { KEY_SETTINGS_PEOPLE_VIEW_GRID, loadJson, saveJson } from "./_storage";

export interface PeopleGridViewSettingsState {
    readonly margin: MarginIdType;
    readonly showNames: boolean;
    readonly showMediaCounts: boolean;
    readonly thumbnailSize: ThumbnailSizeIdType;
    readonly dimThumbnails: boolean;
    readonly sortBy: PersonSortIdType;
}

export const defaultPeopleGridViewSettings: PeopleGridViewSettingsState = {
    margin: defaultMargin,
    showNames: true,
    showMediaCounts: true,
    thumbnailSize: defaultGridThumbnailSize,
    dimThumbnails: true,
    sortBy: defaultPersonSort
};

export type PeopleGridViewSettingsContextValue = [
    state: PeopleGridViewSettingsState,
    actions: {
        setMargin: (margin: MarginIdType) => void;
        setShowNames: (showNames: boolean) => void;
        setShowMediaCounts: (showMediaCounts: boolean) => void;
        setThumbnailSize: (thumbnailSize: ThumbnailSizeIdType) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setSortBy: (sortBy: PersonSortIdType) => void;
    }
];

const PeopleGridViewSettingsContext = createContext<PeopleGridViewSettingsContextValue>();

export const PeopleGridSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadState());

    const setMargin = (margin: MarginIdType) => updateState({ margin });
    const setShowNames = (showNames: boolean) => updateState({ showNames });
    const setShowMediaCounts = (showMediaCounts: boolean) => updateState({ showMediaCounts });
    const setThumbnailSize = (thumbnailSize: ThumbnailSizeIdType) => updateState({ thumbnailSize });
    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });
    const setSortBy = (sortBy: PersonSortIdType) => updateState({ sortBy });

    const updateState = (update: Partial<PeopleGridViewSettingsState>) => {
        setState(update);
        saveState(state);
    };

    return (
        <PeopleGridViewSettingsContext.Provider
            value={[
                state,
                {
                    setMargin,
                    setShowNames,
                    setShowMediaCounts,
                    setThumbnailSize,
                    setDimThumbnails,
                    setSortBy
                }
            ]}
        >
            {props.children}
        </PeopleGridViewSettingsContext.Provider>
    );
};

export const usePeopleGridViewSettingsContext = () => {
    const ctx = useContext(PeopleGridViewSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("PeopleGridViewSettings context not provided by ancestor component!");
};

function loadState() {
    return {
        ...defaultPeopleGridViewSettings,
        ...loadJson(KEY_SETTINGS_PEOPLE_VIEW_GRID, defaultPeopleGridViewSettings)
    };
}

function saveState(state: PeopleGridViewSettingsState) {
    saveJson(KEY_SETTINGS_PEOPLE_VIEW_GRID, state);
}
