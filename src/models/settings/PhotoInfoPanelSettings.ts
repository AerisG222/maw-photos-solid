import { MapTypeIdType, defaultMapTypeId } from '../map-type';
import { MapZoomLevelIdType, defaultMapZoomLevelId } from '../map-zoom-level';

export type PhotoInfoPanelSettingsState = {
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showExif: boolean;
    showEffects: boolean;
    showMetadataEditor: boolean;
    showHistogram: boolean;
    showMinimap: boolean;
    expandedState: boolean;
    minimapZoomId: MapZoomLevelIdType;
    minimapMapTypeId: MapTypeIdType;
};

export const defaultPhotoInfoPanelSettings: PhotoInfoPanelSettingsState = {
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showExif: false,
    showEffects: false,
    showHistogram: false,
    showMetadataEditor: false,
    showMinimap: false,
    expandedState: false,
    minimapMapTypeId: defaultMapTypeId,
    minimapZoomId: defaultMapZoomLevelId,
};
