import { MapTypeIdType, defaultMapType } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevel } from '../map-zoom-level';

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
