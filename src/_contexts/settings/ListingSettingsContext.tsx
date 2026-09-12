import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { DensityIdType, getNextDensity } from "../../_models/Density";
import { PersonSortIdType } from "../../_models/PersonSort";
import { ListingSettingsState, defaultListingSettings } from "./_state";
import { loadMigrated } from "./_migrate";
import { KEY_SETTINGS_V2_LISTING, saveJson } from "./_storage";

export type { ListingSettingsState } from "./_state";
export { defaultListingSettings } from "./_state";

export type ListingSettingsContextValue = [
    state: ListingSettingsState,
    actions: {
        setDensity: (density: DensityIdType) => void;
        setShowLabels: (showLabels: boolean) => void;
        setShowBadges: (showBadges: boolean) => void;
        setDimThumbnails: (dimThumbnails: boolean) => void;
        setHighlightFaces: (highlightFaces: boolean) => void;
        setPeopleSort: (peopleSort: PersonSortIdType) => void;
        cycleDensity: () => void;
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

    const setDensity = (density: DensityIdType) => updateState({ density });

    const setShowLabels = (showLabels: boolean) => updateState({ showLabels });

    const setShowBadges = (showBadges: boolean) => updateState({ showBadges });

    const setDimThumbnails = (dimThumbnails: boolean) => updateState({ dimThumbnails });

    const setHighlightFaces = (highlightFaces: boolean) => updateState({ highlightFaces });

    const setPeopleSort = (peopleSort: PersonSortIdType) => updateState({ peopleSort });

    const cycleDensity = () => updateState({ density: getNextDensity(state.density) });

    return (
        <ListingSettingsContext.Provider
            value={[
                state,
                {
                    setDensity,
                    setShowLabels,
                    setShowBadges,
                    setDimThumbnails,
                    setHighlightFaces,
                    setPeopleSort,
                    cycleDensity
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
