import { MapType } from '../map-type';

export type VideoInfoPanelSettingsState = {
    showRatings: boolean;
    showCategoryTeaserChooser: boolean;
    showComments: boolean;
    showMetadataEditor: boolean;
    showMinimap: boolean;
    expandedState: boolean;
    minimapZoom: number;
    minimapMapType: MapType;
};

export const defaultVideoInfoPanelSettings: VideoInfoPanelSettingsState = {
    showRatings: true,
    showCategoryTeaserChooser: false,
    showComments: true,
    showMetadataEditor: false,
    showMinimap: false,
    expandedState: false,
    minimapMapType: MapType.roadmap,
    minimapZoom: 10,
};
