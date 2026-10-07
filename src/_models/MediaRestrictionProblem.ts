import { ApiError } from "../_contexts/api/ApiError";
import { Uuid } from "./Uuid";

/*
   One reason maw-media refused a restriction.

   A refusal is all or nothing, and it lists every problem rather than the first,
   so a selection can be marked photo by photo in one pass. `mediaId` is null for
   a problem with the request itself - an unknown role, say - and `detail` names
   what the problem is about: a role, a category or a place.
*/
export interface MediaRestrictionProblem {
    mediaId: Uuid | null;
    reason: string;
    detail: string | null;
}

const isProblem = (value: unknown): value is MediaRestrictionProblem =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as MediaRestrictionProblem).reason === "string";

// the problems a failed restriction carried, or none when it failed some other way
export const getRestrictionProblems = (error: unknown): MediaRestrictionProblem[] =>
    error instanceof ApiError && error.status === 400 && Array.isArray(error.body)
        ? error.body.filter(isProblem)
        : [];

export const describeRestrictionProblem = (problem: MediaRestrictionProblem): string => {
    const detail = problem.detail ?? "";

    switch (problem.reason) {
        case "teaser":
            return `It is the teaser of ${detail}. Choose another teaser first.`;
        case "place_cover":
            return `It is the cover of ${detail}. Change or clear that cover first.`;
        case "role_not_granted":
            return `Its category is not shared with ${detail}, so that role could never see it.`;
        case "unknown_role":
            return `There is no role named ${detail}.`;
        case "not_found":
            return "It could not be found.";
        case "no_roles":
            return "Choose at least one role.";
        case "no_media":
            return "Nothing was selected.";
        default:
            return `It could not be restricted (${problem.reason}).`;
    }
};
