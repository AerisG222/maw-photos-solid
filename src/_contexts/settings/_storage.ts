const PREFIX = `maw-photos`;

/*
   The settings the application keeps today. Four stores, because there are four
   questions a preference can answer: what the app looks like, how a listing
   presents its items, how an item is looked at, and where in an area you were.

   The sixteen keys below these are what it used to keep - one per view, per
   area - which is why the same preference could be set in one listing and not
   follow you to the next. They are still read, once, by `_migrate.ts`, and are
   deliberately not deleted: a reader who rolls back to the previous build finds
   their preferences intact.
*/
export const KEY_SETTINGS_V2_APP = `${PREFIX}|v2|app`;
export const KEY_SETTINGS_V2_LISTING = `${PREFIX}|v2|listing`;
export const KEY_SETTINGS_V2_MEDIA = `${PREFIX}|v2|media`;
export const KEY_SETTINGS_V2_AREA = `${PREFIX}|v2|area`;
export const KEY_SETTINGS_V2_MIGRATED = `${PREFIX}|v2|migrated`;

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
export const KEY_SETTINGS_FEED_VIEW_CATEGORY = `${PREFIX}|feedcategoryview`;

/*
   Not a setting - a note of how much space the clan section needed last time, so
   its placeholder can reserve about the right amount rather than a guess. The
   clan list is markedly slower to arrive than the people below it, and a section
   that grows after the fact shoves the whole grid down.
*/
export const KEY_UI_CLAN_COUNT = `${PREFIX}|clancount`;

/*
   Not a setting either - the terms searched for most recently, newest first.
   Kept on this device only, the way the Android app keeps its own.
*/
export const KEY_UI_RECENT_SEARCHES = `${PREFIX}|recentsearches`;

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
