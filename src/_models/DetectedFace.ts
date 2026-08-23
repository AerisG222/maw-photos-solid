import { Uuid } from "./Uuid";

/*
   A face the recognition pipeline found in one media item.

   The box is normalised 0..1 against the source image, which is what lets it be
   drawn over any scale without knowing which one is on screen. A detector may
   report slightly outside that range for a face clipped by the frame edge, so
   values are not assumed to be within it.

   `personId` is null while a face is unassigned - detected, but not yet tied to
   anybody - which is a real and common state, not a loading one.
*/
export interface DetectedFace {
    id: Uuid;
    personId: Uuid | null;
    boxX: number;
    boxY: number;
    boxWidth: number;
    boxHeight: number;
}
