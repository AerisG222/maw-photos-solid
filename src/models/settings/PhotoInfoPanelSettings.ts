import { MapType } from '../map-type';

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
