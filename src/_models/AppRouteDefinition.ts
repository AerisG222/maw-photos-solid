import { RouteDefinition } from '@solidjs/router'

export const AreaAbout = "about";
export const AreaAuth = "auth";
export const AreaCategories = "categories";
export const AreaMedia = "media";
export const AreaRandom = "random";
export const AreaSearch = "search";
export const AreaSettings = "settings";
export const AreaStats = "stats";

export type Area =
    typeof AreaAbout |
    typeof AreaAuth |
    typeof AreaCategories |
    typeof AreaMedia |
    typeof AreaRandom |
    typeof AreaSearch |
    typeof AreaSettings |
    typeof AreaStats;

export type RouteMatch = [boolean, Area];

export type AppRouteDefinition =
    RouteDefinition & {
        icon?: string;
        name?: string;
        tooltip?: string;
        shortcutKeys?: string[];
        absolutePath?: string;
        helpText?: string;
        doesPathMatch?: (path: string) => RouteMatch;
    };
