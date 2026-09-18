/*
   The cards the inspector can show. One ordered list of ids replaces the eight
   independent `show*` booleans the info panel used to keep, which is what lets
   a reader's choice of cards travel between views instead of belonging to the
   detail view alone.
*/
export const InspectorCardComments = "comments";
export const InspectorCardExif = "exif";
export const InspectorCardEffects = "effects";
export const InspectorCardHistogram = "histogram";
export const InspectorCardMinimap = "minimap";
export const InspectorCardMetadata = "metadata";
export const InspectorCardCategoryTeaser = "categoryTeaser";
export const InspectorCardPlaceCovers = "placeCovers";
export const InspectorCardWhere = "where";
export const InspectorCardWho = "who";

export type InspectorCardIdType =
    | typeof InspectorCardComments
    | typeof InspectorCardExif
    | typeof InspectorCardEffects
    | typeof InspectorCardHistogram
    | typeof InspectorCardMinimap
    | typeof InspectorCardMetadata
    | typeof InspectorCardCategoryTeaser
    | typeof InspectorCardPlaceCovers
    | typeof InspectorCardWhere
    | typeof InspectorCardWho;

// the order the sidebar declares them in today, which the migration preserves
export const allInspectorCards: InspectorCardIdType[] = [
    InspectorCardComments,
    InspectorCardExif,
    InspectorCardEffects,
    InspectorCardHistogram,
    InspectorCardMinimap,
    InspectorCardMetadata,
    InspectorCardCategoryTeaser,
    InspectorCardPlaceCovers,
    InspectorCardWhere,
    InspectorCardWho
];

export const defaultInspectorCards: InspectorCardIdType[] = [InspectorCardComments];

export const isInspectorCardId = (value: unknown): value is InspectorCardIdType =>
    typeof value === "string" && (allInspectorCards as string[]).includes(value);
