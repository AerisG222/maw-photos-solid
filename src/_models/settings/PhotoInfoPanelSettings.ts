import { MapTypeIdType, defaultMapType } from '../MapType';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../MapZoomLevel';

export type PhotoInfoPanelSettingsState = {
    expandInfoPanel: boolean;
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showExif: boolean;
    showEffects: boolean;
    showMetadataEditor: boolean;
    showHistogram: boolean;
    showMinimap: boolean;
    minimapZoom: MapZoomLevelIdType;
    minimapMapType: MapTypeIdType;
};

export const defaultPhotoInfoPanelSettings: PhotoInfoPanelSettingsState = {
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
