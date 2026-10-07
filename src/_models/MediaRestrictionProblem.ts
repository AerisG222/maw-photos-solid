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

/*
   Why a change to a category's roles was refused. The same shape as a photo's
   refusal, and read the same way; only the reasons differ. `mediaId` is set for
   restriction_depends alone - a restricted photo in the category whose list
   names a role being taken away.
*/
export const describeCategoryRolesProblem = (problem: MediaRestrictionProblem): string => {
    const detail = problem.detail ?? "";

    switch (problem.reason) {
        case "restriction_depends":
            return `A restricted photo here is visible to ${detail}. Change its restriction before removing ${detail} from the category.`;
        case "would_hide_from_you":
            return "You hold none of those roles, so the category would be hidden from you. Keep one of yours.";
        case "unknown_role":
            return `There is no role named ${detail}.`;
        case "no_roles":
            return "Choose at least one role.";
        default:
            return `The roles could not be changed (${problem.reason}).`;
    }
};
