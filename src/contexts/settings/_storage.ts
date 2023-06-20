const PREFIX = `maw-photos`;

export const KEY_SETTINGS_APP = `${PREFIX}|app`;

export const KEY_SETTINGS_CATEGORY_PAGE =      `${PREFIX}|categorypage`;
export const KEY_SETTINGS_CATEGORY_FILTER =    `${PREFIX}|categoryfilter`;
export const KEY_SETTINGS_CATEGORY_VIEW_GRID = `${PREFIX}|categorygridview`;
export const KEY_SETTINGS_CATEGORY_VIEW_LIST = `${PREFIX}|categorylistview`;

export const KEY_SETTINGS_PHOTO_PAGE =        `${PREFIX}|photopage`;
export const KEY_SETTINGS_PHOTO_VIEW_DETAIL = `${PREFIX}|photodetailview`;
export const KEY_SETTINGS_PHOTO_VIEW_GRID =   `${PREFIX}|photogridview`;
export const KEY_SETTINGS_PHOTO_VIEW_MAP =    `${PREFIX}|photomapview`;
export const KEY_SETTINGS_PHOTO_INFO_PANEL =  `${PREFIX}|photoinfopanel`;

export const KEY_SETTINGS_VIDEO_VIEW_DETAIL = `${PREFIX}|videodetailview`;
export const KEY_SETTINGS_VIDEO_INFO_PANEL =  `${PREFIX}|videoinfopanel`;

export const KEY_SETTINGS_SEARCH_PAGE =      `${PREFIX}|searchpage`;
export const KEY_SETTINGS_SEARCH_VIEW_GRID = `${PREFIX}|searchgridview`;
export const KEY_SETTINGS_SEARCH_VIEW_LIST = `${PREFIX}|searchlistview`;

export const KEY_SETTINGS_RANDOM_PAGE =        `${PREFIX}|randompage`;
export const KEY_SETTINGS_RANDOM_VIEW_DETAIL = `${PREFIX}|randomdetailview`;
export const KEY_SETTINGS_RANDOM_VIEW_GRID =   `${PREFIX}|randomgridview`;
export const KEY_SETTINGS_RANDOM_INFO_PANEL =  `${PREFIX}|randominfopanel`;

export function loadJson<T>(key: string, def: T): T {
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

export function saveJson<T>(key: string, value: T): void {
    if(!value) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
