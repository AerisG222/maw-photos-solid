import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { PersonSortIdType } from "../../_models/PersonSort";
import { ListingSettingsState, defaultListingSettings } from "./_state";
import { loadMigrated } from "./_migrate";
import { KEY_SETTINGS_V2_LISTING, saveJson } from "./_storage";

export type { ListingSettingsState } from "./_state";
export { defaultListingSettings } from "./_state";

export type ListingSettingsContextValue = [
    state: ListingSettingsState,
    actions: {
        setShowLabels: (showLabels: boolean) => void;
        setHighlightFaces: (highlightFaces: boolean) => void;
        setPeopleSort: (peopleSort: PersonSortIdType) => void;
    }
];

const ListingSettingsContext = createContext<ListingSettingsContextValue>();

export const ListingSettingsProvider: ParentComponent = props => {
    const [state, setState] = createStore(
        loadMigrated(KEY_SETTINGS_V2_LISTING, defaultListingSettings)
    );

    const updateState = (update: Partial<ListingSettingsState>) => {
        setState(update);
        saveJson(KEY_SETTINGS_V2_LISTING, state);
    };

    const setShowLabels = (showLabels: boolean) => updateState({ showLabels });

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
