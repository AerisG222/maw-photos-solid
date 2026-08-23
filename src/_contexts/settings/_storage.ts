const PREFIX = `maw-photos`;

export const KEY_SETTINGS_APP = `${PREFIX}|app`;

export const KEY_SETTINGS_CATEGORY_PAGE = `${PREFIX}|categorypage`;
export const KEY_SETTINGS_CATEGORY_FILTER = `${PREFIX}|categoryfilter`;
export const KEY_SETTINGS_CATEGORY_VIEW_GRID = `${PREFIX}|categorygridview`;
export const KEY_SETTINGS_CATEGORY_VIEW_LIST = `${PREFIX}|categorylistview`;

export const KEY_SETTINGS_MEDIA_PAGE = `${PREFIX}|mediapage`;
export const KEY_SETTINGS_MEDIA_VIEW_DETAIL = `${PREFIX}|mediadetailview`;
export const KEY_SETTINGS_MEDIA_VIEW_FULLSCREEN = `${PREFIX}|mediafullscreenview`;
export const KEY_SETTINGS_MEDIA_VIEW_GRID = `${PREFIX}|mediagridview`;
export const KEY_SETTINGS_MEDIA_VIEW_MAP = `${PREFIX}|mediamapview`;
export const KEY_SETTINGS_MEDIA_INFO_PANEL = `${PREFIX}|mediainfopanel`;

export const KEY_SETTINGS_PEOPLE_VIEW_GRID = `${PREFIX}|peoplegridview`;
export const KEY_SETTINGS_FACE_FEED = `${PREFIX}|facefeed`;

/*
   Not a setting - a note of how much space the clan section needed last time, so
   its placeholder can reserve about the right amount rather than a guess. The
   clan list is markedly slower to arrive than the people below it, and a section
   that grows after the fact shoves the whole grid down.
*/
export const KEY_UI_CLAN_COUNT = `${PREFIX}|clancount`;

export const KEY_SETTINGS_SEARCH_PAGE = `${PREFIX}|searchpage`;
export const KEY_SETTINGS_SEARCH_VIEW_GRID = `${PREFIX}|searchgridview`;
export const KEY_SETTINGS_SEARCH_VIEW_LIST = `${PREFIX}|searchlistview`;

export function loadJson<T>(key: string, def: T): T {
    const val = localStorage.getItem(key);

    if (val) {
        try {
            return JSON.parse(val) as T;
        } catch {
            // swallow
        }
    }

    return def;
}

export function saveJson<T>(key: string, value: T): void {
    if (!value) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
