import { MapTypeIdType, defaultMapTypeId } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevelId } from '../map-zoom-level';

export type VideoInfoPanelSettingsState = {
    expandInfoPanel: boolean;
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showMetadataEditor: boolean;
    showMinimap: boolean;
    minimapMapTypeId: MapTypeIdType;
    minimapZoomId: MapZoomLevelIdType;
};

export const defaultVideoInfoPanelSettings: VideoInfoPanelSettingsState = {
    expandInfoPanel: false,
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showMetadataEditor: false,
    showMinimap: false,
    minimapMapTypeId: defaultMapTypeId,
    minimapZoomId: defaultMapZoomLevelId,
};
