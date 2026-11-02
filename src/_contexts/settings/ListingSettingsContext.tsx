import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { PersonSortIdType } from "../../_models/PersonSort";
import { LabelArea, ListingSettingsState } from "./_state";
import { loadListingSettings } from "./_migrate";
import { KEY_SETTINGS_V2_LISTING, saveJson } from "./_storage";

export type { LabelArea, ListingSettingsState } from "./_state";
export { defaultListingSettings } from "./_state";

export type ListingSettingsContextValue = [
    state: ListingSettingsState,
    actions: {
        setShowLabels: (area: LabelArea, showLabels: boolean) => void;
        setHighlightFaces: (highlightFaces: boolean) => void;
        setPeopleSort: (peopleSort: PersonSortIdType) => void;
    }
];

const ListingSettingsContext = createContext<ListingSettingsContextValue>();

export const ListingSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(loadListingSettings());

    const updateState = (update: Partial<ListingSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_LISTING, state);
    };

    const setShowLabels = (area: LabelArea, showLabels: boolean) =>
        updateState({ labels: { ...state.labels, [area]: showLabels } });

    const setHighlightFaces = (highlightFaces: boolean) => updateState({ highlightFaces });

    const setPeopleSort = (peopleSort: PersonSortIdType) => updateState({ peopleSort });

    return (
        <ListingSettingsContext.Provider
            value={[
                state,
                {
                    setShowLabels,
                    setHighlightFaces,
                    setPeopleSort
                }
            ]}
        >
            {props.children}
        </ListingSettingsContext.Provider>
    );
};

export const useListingSettingsContext = () => {
    const ctx = useContext(ListingSettingsContext);

    if (ctx) {
        return ctx;
    }

    throw new Error("ListingSettings context not provided by ancestor component!");
};
