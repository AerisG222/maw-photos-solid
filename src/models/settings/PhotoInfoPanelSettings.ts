import { MapType } from '../map-type';
import { KEY_SETTINGS_PHOTO_INFO_PANEL, loadJson } from './storage';

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
    minimapZoom: number;
    minimapMapType: MapType;
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
    minimapMapType: MapType.roadmap,
    minimapZoom: 10,
};

export function loadPhotoInfoPanelSettings() {
    return loadJson(KEY_SETTINGS_PHOTO_INFO_PANEL, defaultPhotoInfoPanelSettings);
}
