/*
   An adapter, not a store.

   The panel's eight independent `show*` booleans are one ordered list of card
   ids now, which is what lets a reader's choice of cards travel between views
   instead of belonging to the detail view alone. The booleans below are that
   list, read one card at a time, for the callers that still expect them.
*/

import {
    InspectorCardCategoryTeaser,
    InspectorCardComments,
    InspectorCardEffects,
    InspectorCardExif,
    InspectorCardHistogram,
    InspectorCardIdType,
    InspectorCardMetadata,
    InspectorCardMinimap,
    InspectorCardPlaceCovers
} from "../../_models/InspectorCard";
import { MapTypeIdType } from "../../_models/MapType";
import { MapZoomLevelIdType } from "../../_models/MapZoomLevel";
import { useMediaSettingsContext } from "./MediaSettingsContext";

export interface MediaInfoPanelSettingsState {
    readonly expandInfoPanel: boolean;
    readonly showCategoryTeaserChooser: boolean;
    readonly showPlaceCovers: boolean;
    readonly showComments: boolean;
    readonly showExif: boolean;
    readonly showEffects: boolean;
    readonly showMetadataEditor: boolean;
    readonly showHistogram: boolean;
    readonly showMinimap: boolean;
    readonly minimapZoom: MapZoomLevelIdType;
    readonly minimapMapType: MapTypeIdType;
}

export type MediaInfoPanelSettingsContextValue = [
    state: MediaInfoPanelSettingsState,
    actions: {
        setExpandInfoPanel: (expandInfoPanel: boolean) => void;
        setShowCategoryTeaserChooser: (show: boolean) => void;
        setShowPlaceCovers: (show: boolean) => void;
        setShowComments: (show: boolean) => void;
        setShowExif: (show: boolean) => void;
        setShowEffects: (show: boolean) => void;
        setShowMetadataEditor: (show: boolean) => void;
        setShowHistogram: (show: boolean) => void;
        setShowMinimap: (show: boolean) => void;
        setMinimapZoom: (zoom: MapZoomLevelIdType) => void;
        setMinimapMapType: (mapType: MapTypeIdType) => void;
    }
];

export const useMediaInfoPanelSettingsContext = (): MediaInfoPanelSettingsContextValue => {
    const [media, mediaActions] = useMediaSettingsContext();

    const shows = (card: InspectorCardIdType) => media.inspectorCards.includes(card);

    /*
       The old setters took a boolean; the store takes a toggle. Only act when
       the two disagree, so `setShowExif(true)` on an already-open card is the
       no-op its callers assume rather than a close.
    */
    const set = (card: InspectorCardIdType, show: boolean) => {
        if (shows(card) !== show) {
            mediaActions.toggleInspectorCard(card);
        }
    };

    // getters, so reading a field inside a tracking scope still subscribes to it
    const state: MediaInfoPanelSettingsState = {
        get expandInfoPanel() {
            return media.inspectorOpen;
        },
        get showCategoryTeaserChooser() {
            return shows(InspectorCardCategoryTeaser);
        },
        get showPlaceCovers() {
            return shows(InspectorCardPlaceCovers);
        },
        get showComments() {
            return shows(InspectorCardComments);
        },
        get showExif() {
            return shows(InspectorCardExif);
        },
        get showEffects() {
            return shows(InspectorCardEffects);
        },
        get showMetadataEditor() {
            return shows(InspectorCardMetadata);
        },
        get showHistogram() {
            return shows(InspectorCardHistogram);
        },
        get showMinimap() {
            return shows(InspectorCardMinimap);
        },
        /*
           The panel used to keep its own copy of both of these, so the minimap
           and the map view could disagree about the same map. There is one now.
        */
        get minimapZoom() {
            return media.mapZoom;
        },
        get minimapMapType() {
            return media.mapType;
        }
    };

    return [
        state,
        {
            setExpandInfoPanel: open => mediaActions.setInspectorOpen(open),
            setShowCategoryTeaserChooser: show => set(InspectorCardCategoryTeaser, show),
            setShowPlaceCovers: show => set(InspectorCardPlaceCovers, show),
            setShowComments: show => set(InspectorCardComments, show),
            setShowExif: show => set(InspectorCardExif, show),
            setShowEffects: show => set(InspectorCardEffects, show),
            setShowMetadataEditor: show => set(InspectorCardMetadata, show),
            setShowHistogram: show => set(InspectorCardHistogram, show),
            setShowMinimap: show => set(InspectorCardMinimap, show),
            setMinimapZoom: zoom => mediaActions.setMapZoom(zoom),
            setMinimapMapType: mapType => mediaActions.setMapType(mapType)
        }
    ];
};
