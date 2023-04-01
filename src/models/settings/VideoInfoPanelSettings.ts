import { MapTypeIdType, defaultMapTypeId } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevelId } from '../map-zoom-level';

export type VideoInfoPanelSettingsState = {
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showMetadataEditor: boolean;
    showMinimap: boolean;
    expandedState: boolean;
    minimapMapTypeId: MapTypeIdType;
    minimapZoomId: MapZoomLevelIdType;
};

export const defaultVideoInfoPanelSettings: VideoInfoPanelSettingsState = {
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showMetadataEditor: false,
    showMinimap: false,
    expandedState: false,
    minimapMapTypeId: defaultMapTypeId,
    minimapZoomId: defaultMapZoomLevelId,
};
