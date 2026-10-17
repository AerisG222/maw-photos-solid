import { SearchSchemaInput } from "@tanstack/solid-router";

import { StatMode } from "./_funcs";

export type StatType = "all" | "photo" | "video";

export interface StatsSearch {
    type: StatType;
    mode: StatMode;
}

const statTypes: readonly StatType[] = ["all", "photo", "video"];
const statModes: readonly StatMode[] = ["category-count", "count", "size", "duration"];

const pick = <T extends string>(allowed: readonly T[], value: unknown, fallback: T): T =>
    allowed.includes(value as T) ? (value as T) : fallback;

/*
   What a stats address may say, and what it means when it says nothing: a
   typo in the query string, or a value from an older version, falls back to the
   default rather than reaching the charts as a string nobody checked.

   The summary defaults to counting categories; a single year has no categories
   to count across, so it defaults to counting media.

   The input is typed as what a link may pass - either may be left out, for the
   default - while what actually arrives from the address bar is still checked
   as if it could be anything, because it can.
*/
export const validateStatsSearch =
    (defaultMode: StatMode) =>
    (search: Partial<StatsSearch> & SearchSchemaInput): StatsSearch => ({
        type: pick(statTypes, search.type, "all"),
        mode: pick(statModes, search.mode, defaultMode)
    });
