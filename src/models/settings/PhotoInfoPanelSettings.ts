import { MapTypeIdType, defaultMapTypeId } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevelId } from '../map-zoom-level';

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
    minimapZoomId: MapZoomLevelIdType;
    minimapMapTypeId: MapTypeIdType;
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
    minimapMapTypeId: defaultMapTypeId,
    minimapZoomId: defaultMapZoomLevelId,
};
