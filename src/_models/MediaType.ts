export type MediaType = ("photo" | "video") & { readonly __brand: unique symbol };

export const MediaTypePhoto = "photo" as MediaType;
export const MediaTypeVideo = "video" as MediaType;
