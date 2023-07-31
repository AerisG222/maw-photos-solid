const PREFIX = `maw-photos`;

export const KEY_SETTINGS_APP = `${PREFIX}|app`;

export const KEY_SETTINGS_CATEGORY_PAGE =      `${PREFIX}|categorypage`;
export const KEY_SETTINGS_CATEGORY_FILTER =    `${PREFIX}|categoryfilter`;
export const KEY_SETTINGS_CATEGORY_VIEW_GRID = `${PREFIX}|categorygridview`;
export const KEY_SETTINGS_CATEGORY_VIEW_LIST = `${PREFIX}|categorylistview`;

export const KEY_SETTINGS_MEDIA_PAGE =        `${PREFIX}|mediapage`;
export const KEY_SETTINGS_MEDIA_VIEW_DETAIL = `${PREFIX}|mediadetailview`;
export const KEY_SETTINGS_MEDIA_VIEW_GRID =   `${PREFIX}|mediagridview`;
export const KEY_SETTINGS_MEDIA_VIEW_MAP =    `${PREFIX}|mediamapview`;
export const KEY_SETTINGS_MEDIA_INFO_PANEL =  `${PREFIX}|mediainfopanel`;

export const KEY_SETTINGS_SEARCH_PAGE =      `${PREFIX}|searchpage`;
export const KEY_SETTINGS_SEARCH_VIEW_GRID = `${PREFIX}|searchgridview`;
export const KEY_SETTINGS_SEARCH_VIEW_LIST = `${PREFIX}|searchlistview`;

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
