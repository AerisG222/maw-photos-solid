const PREFIX = `maw-photos`;

const KEY_SETTINGS_APP = `${PREFIX}|app`;

const KEY_SETTINGS_CATEGORY_PAGE = `${PREFIX}|categorypage`;
const KEY_SETTINGS_CATEGORY_FILTER = `${PREFIX}|categoryfilter`;
const KEY_SETTINGS_CATEGORY_VIEW_GRID = `${PREFIX}|categorygridview`;
const KEY_SETTINGS_CATEGORY_VIEW_LIST = `${PREFIX}|categorylistview`;

const KEY_SETTINGS_PHOTO_PAGE = `${PREFIX}|photopage`;
const KEY_SETTINGS_PHOTO_VIEW_DETAIL = `${PREFIX}|photodetailview`;
const KEY_SETTINGS_PHOTO_VIEW_MAP = `${PREFIX}|photomapview`;
const KEY_SETTINGS_PHOTO_VIEW_GRID = `${PREFIX}|photogridview`;
const KEY_SETTINGS_PHOTO_INFO_PANEL = `${PREFIX}|photoinfopanel`;

const KEY_SETTINGS_VIDEO_DETAIL_VIEW = `${PREFIX}|videodetailview`;
const KEY_SETTINGS_VIDEO_INFO_PANEL = `${PREFIX}|videoinfopanel`;

const KEY_SETTINGS_SEARCH_PAGE = `${PREFIX}|searchpage`;
const KEY_SETTINGS_SEARCH_VIEW_GRID = `${PREFIX}|searchgridview`;
const KEY_SETTINGS_SEARCH_VIEW_LIST = `${PREFIX}|searchlistview`;

const KEY_SETTINGS_RANDOM_PAGE = `${PREFIX}|randompage`;
const KEY_SETTINGS_RANDOM_VIEW_DETAIL = `${PREFIX}|randomdetailview`;
const KEY_SETTINGS_RANDOM_VIEW_GRID = `${PREFIX}|randomgridview`;
const KEY_SETTINGS_RANDOM_INFO_PANEL = `${PREFIX}|randominfopanel`;

const KEY_SETTINGS_VERSION = `${PREFIX}|version`;

export type AppSettingsState = {
    readonly theme: string;
};

export const defaultAppSettings: AppSettingsState = {
    theme: 'dark'
};

export function loadAppSettings() {
    return loadJson(KEY_SETTINGS_APP, defaultAppSettings);
}

function loadJson<T>(key: string, def: T): T {
    const val = localStorage.getItem(key);

    if(val) {
        try {
            return JSON.parse(val);
        } catch {
            // swallow
        }
    }

    return def;
}
