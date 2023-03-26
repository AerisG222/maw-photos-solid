import { MapType } from '../map-type';
import { KEY_SETTINGS_RANDOM_INFO_PANEL, loadJson } from './storage';

export type RandomInfoPanelSettingsState = {
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

export const defaultRandomInfoPanelSettings: RandomInfoPanelSettingsState = {
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

export function loadRandomInfoPanelSettings() {
    return loadJson(KEY_SETTINGS_RANDOM_INFO_PANEL, defaultRandomInfoPanelSettings);
}
