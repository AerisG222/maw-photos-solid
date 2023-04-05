import { MapTypeIdType, defaultMapType } from '../MapType';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../MapZoomLevel';

export type RandomInfoPanelSettingsState = {
    expandInfoPanel: boolean;
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showExif: boolean;
    showEffects: boolean;
    showMetadataEditor: boolean;
    showHistogram: boolean;
    showMinimap: boolean;
    minimapMapType: MapTypeIdType;
    minimapZoom: MapZoomLevelIdType;
};

export const defaultRandomInfoPanelSettings: RandomInfoPanelSettingsState = {
    expandInfoPanel: false,
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showExif: false,
    showEffects: false,
    showHistogram: false,
    showMetadataEditor: false,
    showMinimap: false,
    minimapMapType: defaultMapType,
    minimapZoom: defaultMapZoomLevel,
};
