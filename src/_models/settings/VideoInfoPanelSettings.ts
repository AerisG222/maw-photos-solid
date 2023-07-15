import { MapTypeIdType, defaultMapType } from '../MapType';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../MapZoomLevel';

export type VideoInfoPanelSettingsState = {
    expandInfoPanel: boolean;
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showMetadataEditor: boolean;
    showMinimap: boolean;
    minimapMapType: MapTypeIdType;
    minimapZoom: MapZoomLevelIdType;
};

export const defaultVideoInfoPanelSettings: VideoInfoPanelSettingsState = {
    expandInfoPanel: false,
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showMetadataEditor: false,
    showMinimap: false,
    minimapMapType: defaultMapType,
    minimapZoom: defaultMapZoomLevel,
};
